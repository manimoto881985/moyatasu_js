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
      mode: 'default',
      articles: [],
      displaySize: 10,
      displayDate: null,
      me: null
    }
  }

  // Component Methods
  componentDidMount() { //AppComponent

    auth.onAuthStateChanged(user => {
      console.log(this.state)

      if (user) {
          switch (this.state.mode) {
            case 'specificDate':
              const timestamp_start = new Date(this.state.displayDate.start);
              var tmp = new Date(this.state.displayDate.end);
              tmp.setDate( tmp.getDate() + 1);
              const timestamp_end = tmp;

              this._queryFirestore(
                dbCollectionArticles.orderBy('created', 'desc')
                .where('created', '>=', timestamp_start)
                .where('created', '<', timestamp_end)
                ,user);
              break;
            default:
              this._queryFirestore(
                dbCollectionArticles.limit(this.state.displaySize).orderBy('created', 'desc')
              , user);
              break;
        }
      } else {
        this.setState({
          me: null
        })
      }
    });
  }

    _queryFirestore(collections,user){
      collections.onSnapshot((docSnapShot) => {
          let articles = [];

          docSnapShot.forEach(doc => {
            let data = doc.data();
                data.id = doc.id;

            // Articleに紐づくコメント取得
            dbCollectionComments
              .where("articleId", "==", doc.id)
              .orderBy('created')
              .get().then(querySnapshot => {
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
      };


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
          最近<select id='sizepicker'>
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
            <button className="moya__display" onClick={this.displayLatestArticles}>件の投稿をみる</button>
            <br></br>
            <br></br>
            <input type="date" id='datepicker_start'></input>〜
            <input type="date" id='datepicker_end'></input>
            <button className="moya__display" onClick={this.displayArticlesOnSpecificDate}>の投稿をみる</button>
          </div>
        </section>
      )
    }

  displayLatestArticles = (e) => {
    var sizeNumber = parseInt(document.getElementById('sizepicker').value);
    this.setState({ mode: 'latest', displaySize: sizeNumber, displayDate: null });
    this.componentDidMount();
    document.getElementById('datepicker_start').value = null;
    document.getElementById('datepicker_end').value = null;
  }

  displayArticlesOnSpecificDate = (e) => {
    var dateStrStart = document.getElementById('datepicker_start').value;
    var dateStrEnd = document.getElementById('datepicker_end').value;
    if (dateStrStart === ""){
      alert("日付を指定してください");
    }else if (dateStrEnd === ""){
      alert("日付を指定してください");
    }
    else{
      this.setState({ mode: 'specificDate', displaySize: null, displayDate: { start:dateStrStart, end: dateStrEnd } });
      this.componentDidMount();
    }
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
