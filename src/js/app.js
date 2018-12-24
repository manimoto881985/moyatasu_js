import React from 'react';
import DayJS from 'dayjs';
import Textarea from 'react-textarea-autosize';
import remark from 'remark'
import reactRenderer from 'remark-react'
import remarkBreaks from 'remark-breaks'
import remarkExternalLinks from 'remark-external-links'
import {db, auth, provider, fieldValue} from './firebase'

const dbCollectionArticles = db.collection("messages");
const remarkProcessor = remark().use(reactRenderer).use(remarkBreaks).use(remarkExternalLinks);

class App extends React.Component {
  constructor () {
    super();
    this.state = {
      articles: [],
      article: '',
      me: null
    }
  }

  addTodo = (e) => {
    e.preventDefault();

    const article = this.state.article
    if (!article) { return; }

    this.setState({
      article: ''
    });
    const submit = document.getElementById('submit');
    submit.focus();

    const ref = dbCollectionArticles.doc();
    ref.set({
      message: article,
      created: fieldValue.serverTimestamp(),
      uid: this.state.me ? this.state.me.uid : 'nobody',
      displayName: this.state.me ? this.state.me.displayName : 'noname'
    }).then(function(docRef) {
      console.log(docRef);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  deleteTodo = (e) => {
    if(window.confirm('本当に削除しますか？')){
      dbCollectionArticles.doc(e.target.value).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removeing document: ", error);
      });
    }
  }

  addComment = (e) => {
    e.preventDefault();

    const articleId = e.target.dataset.articleId;
    const key = `comment-${articleId}`

    const comment = this.state[key];
    if (!comment) { return; }

    this.setState({
      [key]: ''
    });

    const article = dbCollectionArticles.doc(articleId);
    const ref = article.collection('comments').doc();
    ref.set({
      message: comment,
      created: fieldValue.serverTimestamp(),
      uid: this.state.me ? this.state.me.uid : 'nobody',
      displayName: this.state.me ? this.state.me.displayName : 'noname'
    }).then(function(docRef) {
      article.update({
        updated: fieldValue.serverTimestamp()
      }).then(function(docRef) {
        console.log(docRef);
      }).catch(function(error) {
        console.error("Error update document: ", error);
      });
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  deleteComment = (e) => {
    if(window.confirm('本当に削除しますか？')){
      const commentId = e.target.value;
      const articleId = e.target.dataset.articleId;
      const article = dbCollectionArticles.doc(articleId);
      const comment = article.collection('comments').doc(commentId);

      comment.delete().then(function() {
        article.update({
          deletedCommentAt: fieldValue.serverTimestamp()
        }).then(function(docRef) {
          console.log(docRef);
        }).catch(function(error) {
          console.error("Error update document: ", error);
        });
      }).catch(function(error) {
        console.error("Error removeing comment: ", error);
      });
    }
  }

  login = (e) => {
    auth.signInWithPopup(provider);
  }

  logout = (e) => {
    auth.signOut();
  }

  handleChange = (e) => {
    const t = e.target;
    this.setState({
      [t.name]: t.value
    })
  }

  componentWillMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        dbCollectionArticles.orderBy('created').onSnapshot((docSnapShot) => {
          let articles = [];

          docSnapShot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;

            let data_comments = [];
            const dbCollectionArticlesComments = dbCollectionArticles.doc(data.id).collection('comments').orderBy('created');
            dbCollectionArticlesComments.get().then(querySnapshot => {
              querySnapshot.forEach(comment_doc => {
                let comment_data = comment_doc.data();
                comment_data.id = comment_doc.id;
                data_comments.push(comment_data);
              });
              return data_comments;
            }).then(result_data_comments => {
              data.comments = result_data_comments;
              articles.push(data);

              this.setState({
                articles,
                loaded: true,
                me: user
              })
            });
          });
        })
      } else {
        this.setState({
          me: null
        })
      }
    });
  }

  renderTodoList () {
    const articles = this.state.articles.slice();

    const articlesLength = articles.length;
    const ListItem = articles.reverse().map((article, index) => {
      const imageIndex = ((articlesLength - index) % 45) + 1;
      const imagePath = `images/${imageIndex}.gif`;
      const created = article.created ?
        DayJS.unix(article.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
        DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const deleteButton = article.uid === this.state.me.uid ?
        <button value={article.id} className="moya__delete_link" onClick={this.deleteTodo}>[削除]</button> :
        null

      const content = remarkProcessor.processSync(article.message).contents

      return (
        <div key={index} className="nes-container is-dark with-title moya__item">
          <div className="title moya__title">
            {article.displayName}
          </div>
          <div className="moya__content">
            <div className="moya__user_image_container">
              <img src={imagePath} className="moya__user_image" alt="icon"/>
            </div>
            <div className="moya__content_text">
              <div>
                {content}
              </div>
              <div className="moya__datetime">
                {created}
                {deleteButton}
              </div>
            </div>
          </div>
          <div className="moya__comments">
            {this.renderComments(article)}
          </div>
        </div>
      )
    })

    return (
      <div>
        {ListItem}
      </div>
    )
  }

  renderComments (article) {
    const name = `comment-${article.id}`
    const ListComment = article.comments.map((comment, index) => {
      const created = comment.created ?
        DayJS.unix(comment.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
        DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const deleteButton = comment.uid === this.state.me.uid ?
        <button value={comment.id} data-article-id={article.id} className="moya__delete_link" onClick={this.deleteComment}>[削除]</button> :
        null
      const content = remarkProcessor.processSync(comment.message).contents

      return (
        <div key={index} className="moya__comment">
          <div className="moya__comment__header">
            <div className="moya__comment__title">{comment.displayName}</div>
            <div className="moya__comment__datetime">
              {created}
              {deleteButton}
            </div>
          </div>
          <div className="moya__comment__content">
            {content}
          </div>
        </div>
      )
    })

    return (
      <div>
        {ListComment}
        <form autoComplete="off" className="moya__comment__form" onSubmit={this.addComment}>
          <Textarea
            minRows={1}
            id="message"
            className="moya_comment_message"
            placeholder="コメントを追加..."
            onChange={this.handleChange}
            name={name}
            value={this.state[`comment-${article.id}`]}
          />
          <div className="moya__comment__form__submit">
            <button type="submit" id="submit" data-article-id={article.id} onClick={this.addComment}>Submit</button>
          </div>
        </form>
      </div>
    )
  }

  renderHeader () {
    return (
      <header className="moya__header">
        <h1>
          <img src="images/obousan.gif" className="moya__h1_image moya__h1_image_first" alt="obousan"/>
          MOYAMOYA GUGUTASU
          <img src="images/samurai.gif" className="moya__h1_image moya__h1_image_last" alt="samurai"/>
        </h1>
        <button onClick={this.login} className={this.state.me ? 'hidden' : undefined}>Login</button>
        <button onClick={this.logout} className={!this.state.me ? 'hidden' : undefined}>Logout</button>
      </header>
    )
  }

  renderContent () {
    return (
      <section className="moya__container">
        <form autoComplete="off" className="moya__form" onSubmit={this.addTodo}>
          <Textarea
            minRows={3}
            id="message"
            className="moya_message"
            placeholder="最近の出来事を共有..."
            onChange={this.handleChange}
            name="article"
            value={this.state.article}
          />
          <div className="moya__form__submit">
            <button type="submit" id="submit" onClick={this.addTodo}>Submit</button>
          </div>
        </form>
        {this.renderTodoList()}
      </section>
    )
  }

  render () {
    return (
      <div className="App">
        {this.renderHeader()}
        {this.state.me && this.renderContent()}
      </div>
    )
  }
}

export default App;
