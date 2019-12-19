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

        // Articles取得
        dbCollectionArticlesLimit.orderBy('created', 'desc').onSnapshot((docSnapShot) => {
          let articles = [];

          docSnapShot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;

            // Articleに紐づくコメント取得
            dbCollectionComments.where("articleId", "==", doc.id).orderBy('created').get().then(querySnapshot => {
              let comments = [];
              querySnapshot.forEach(function(commentDoc) {
                let commentData = commentDoc.data();
                commentData.id = commentDoc.id;
                comments.push(commentData);
              });
              return comments;
            }).then(comments => {
              data.comments = comments || [];
              articles.push(data);

              this.setState({
                articles,
                loaded: true,
                me: user
              });
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
