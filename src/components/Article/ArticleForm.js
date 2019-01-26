import React from 'react'
import Textarea from 'react-textarea-autosize';
import {db, fieldValue} from '../../js/firebase';

const dbCollectionArticles = db.collection("messages");

class ArticleForm extends React.Component {
  constructor() {
    super();
    this.state = {
      article: ''
    }
  }

  addArticle = (e) => {
    e.preventDefault();

    const article = this.state.article
    if (!article) { return; }

    this._clearState('article');
    this._clearArticleTextarea();
    this._focusSubmit();

    const ref = dbCollectionArticles.doc();
    ref.set({
      message: article,
      created: fieldValue.serverTimestamp(),
      updated: fieldValue.serverTimestamp(),
      uid: this.props.stateMe ? this.props.stateMe.uid : 'nobody',
      displayName: this.props.stateMe ? this.props.stateMe.displayName : 'noname'
    }).then(function(docRef) {
      console.log(docRef);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  handleChange = (e) => {
    const t = e.target;
    this.state.article = t.value;
  }

  // Private Methods
    _focusSubmit() {
      document.getElementById('submit').focus();
    }

    _clearState(key) {
      this.setState({[key]: ''}, () => {
        this.setState({[key]: undefined});
      });
    }

    _clearArticleTextarea() {
      document.getElementById('article').value = '';
    }

  render() {
    return (
      <form autoComplete="off" className="moya__form" onSubmit={this.addArticle}>
        <Textarea
          minRows={3}
          id="article"
          className="moya__article__textarea"
          placeholder="最近の出来事を共有..."
          onChange={this.handleChange}
          name="article"
        />
        <div className="moya__form__submit">
          <button type="submit" id="submit" onClick={this.addArticle}>Submit</button>
        </div>
      </form>
    )
  }
}

export default ArticleForm
