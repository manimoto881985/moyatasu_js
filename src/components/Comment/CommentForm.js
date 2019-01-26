import React from 'react'
import Textarea from 'react-textarea-autosize';
import {db, fieldValue} from '../../js/firebase';

const dbCollectionArticles = db.collection("messages");
const dbCollectionComments = db.collection("comments");

class CommentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: ''
    }
  }

  addComment = (e) => {
    e.preventDefault();

    const articleId = e.target.dataset.articleId;
    const textareaId = e.target.dataset.textareaId;
    const comment = this.state.comment;
    if (!comment) { return; }

    console.log(e.target);
    this._clearState('comment');
    this._clearCommentTextarea(textareaId);

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

  handleChange = (e) => {
    const t = e.target;
    this.state.comment = t.value;
  }

  // Private Methods
    _clearState(key) {
      this.setState({[key]: ''}, () => {
        this.setState({[key]: undefined});
      });
    }

    _clearCommentTextarea(textareaId) {
      document.getElementById(textareaId).value = '';
    }

  render() {
    const textareaName = `comment-${this.props.article.id}`

    return (
      <form autoComplete="off" className="moya__comment__form"
        data-article-id={this.props.article.id}
        data-textarea-id={textareaName}
        onSubmit={this.addComment}
      >
        <Textarea
          minRows={1}
          id={textareaName}
          className="moya_comment_message"
          placeholder="コメントを追加..."
          onChange={this.handleChange}
          name={textareaName}
        />
        <div className="moya__comment__form__submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    )
  }
}

export default CommentForm
