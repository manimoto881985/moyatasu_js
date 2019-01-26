import React from 'react'
import Textarea from 'react-textarea-autosize';
import {db, fieldValue} from '../../js/firebase';

const dbCollectionArticles = db.collection("messages");
const dbCollectionComments = db.collection("comments");

class CommentForm extends React.Component {
  constructor() {
    super();
    this.input = React.createRef();
  }

  addComment = (e) => {
    e.preventDefault();

    const articleId = e.target.dataset.articleId;
    const comment = this.input.current.value;
    if (!comment) { return; }
    this.input.current.value = '';

    const article = dbCollectionArticles.doc(articleId);
    const ref = dbCollectionComments.doc();

    ref.set({
      articleId: articleId,
      message: comment,
      created: fieldValue.serverTimestamp(),
      uid: this.props.stateMe ? this.props.stateMe.uid : 'nobody',
      displayName: this.props.stateMe ? this.props.stateMe.displayName : 'noname'
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

  render() {
    const textareaName = `comment-${this.props.article.id}`

    return (
      <form autoComplete="off" className="moya__comment__form" data-article-id={this.props.article.id} onSubmit={this.addComment}>
        <Textarea
          minRows={1}
          id={textareaName}
          className="moya_comment_message"
          placeholder="コメントを追加..."
          name={textareaName}
          inputRef={this.input}
        />
        <div className="moya__comment__form__submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    )
  }
}

export default CommentForm
