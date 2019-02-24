import React from 'react';
import {db, auth} from './firebase';
import Header from '../components/Header';
import ArticleForm from '../components/Article/ArticleForm';
import ArticleList from '../components/Article/ArticleList';

const dbCollectionArticles = db.collection("messages");
const dbCollectionComments = db.collection("comments");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      me: null
    }
  }

  // Component Methods
  componentDidMount() {
    const DISPLAY_NUMBER = 20;

    auth.onAuthStateChanged(user => {
      if (user) {
        const dbCollectionArticlesLimit = this.state.displayAll ?
          dbCollectionArticles :
          dbCollectionArticles.limit(DISPLAY_NUMBER);
        dbCollectionArticlesLimit.orderBy('created', 'desc').onSnapshot((docSnapShot) => {
          dbCollectionComments.orderBy('created').get().then(querySnapshot => {
            const dataCommentsHash = this._generateCommentsHash(querySnapshot);
            return dataCommentsHash
          }).then(commentsHash => {
            const articles = this._buildArticles(docSnapShot, commentsHash)

            this.setState({
              articles,
              loaded: true,
              me: user
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

  // Private Methods
    // componentWillMount ()
    _generateCommentsHash(querySnapshot) {
      let comments = {};

      querySnapshot.forEach(comment_doc => {
        let comment_data = comment_doc.data();
        comment_data.id = comment_doc.id;
        const articleId = comment_data.articleId;
        if(!comments[articleId]){ comments[articleId] = []; }
        comments[articleId].push(comment_data);
      });

      return comments;
    }

    _buildArticles(docSnapShot, commentsHash) {
      let articles = [];

      docSnapShot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        data.comments = commentsHash[doc.id] || [];
        articles.push(data);
      });

      return articles;
    }

    // render ()
    _renderContent() {
      return (
        <section className="moya__container">
          <ArticleForm
            stateMe={this.state.me}
          />

          <ArticleList
            articles={this.state.articles.slice()}
            state={this.state}
            stateMe={this.state.me}
          />
          <div className="moya__display_menu">
            <button className="moya__display_all" onClick={this.displayAll}>すべて見る</button>
          </div>
        </section>
      )
    }

  displayAll = (e) => {
    this.setState({
      displayAll: true
    });
    this.componentDidMount();
  }

  // Render Method
  render() {
    return (
      <div className="App">
        <Header stateMe={this.state.me}/>
        {this.state.me && this._renderContent()}
      </div>
    )
  }
}

export default App;
