import React from 'react'
import Textarea from 'react-textarea-autosize';
import {db, fieldValue} from '../../js/firebase';

const dbCollectionArticles = db.collection("messages");

class ArticleForm extends React.Component {
  constructor() {
    super();
    this.input = React.createRef();
  }

  addArticle = (e) => {
    e.preventDefault();
    const article = this.input.current.value;

    if (!article) { return; }
    this._focusSubmit();
    this.input.current.value = '';

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

  // Private Methods
    _focusSubmit() {
      document.getElementById('submit').focus();
    }

  render() {
    return (
      <form autoComplete="off" className="moya__form" onSubmit={this.addArticle}>
        <Textarea
          minRows={3}
          id="article"
          className="moya__article__textarea"
          placeholder="最近の出来事を共有..."
          name="article"
          inputRef={this.input}
        />
        <div className="moya__form__submit">
          <button type="submit" id="submit">Submit</button>
        </div>
      </form>
    )
  }
}

export default ArticleForm
