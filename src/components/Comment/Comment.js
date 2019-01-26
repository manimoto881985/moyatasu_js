import React from 'react'
import DayJS from 'dayjs';
import remark from 'remark'
import reactRenderer from 'remark-react'
import remarkBreaks from 'remark-breaks'
import remarkExternalLinks from 'remark-external-links'
import ExpandCollapse from 'react-expand-collapse';
import {db, fieldValue} from '../../js/firebase';
const remarkProcessor = remark().use(reactRenderer).use(remarkBreaks).use(remarkExternalLinks);
const dbCollectionArticles = db.collection("messages");
const dbCollectionComments = db.collection("comments");

class Comment extends React.Component {
  deleteComment = (e) => {
    if(window.confirm('本当に削除しますか？')){
      const commentId = e.target.value;
      const articleId = e.target.dataset.articleId;
      const article = dbCollectionArticles.doc(articleId);
      const comment = dbCollectionComments.doc(commentId);

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

  render() {
    const created = this.props.comment.created ?
      DayJS.unix(this.props.comment.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
      DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const deleteButton = this.props.comment.uid === this.props.stateMe.uid ?
      <button value={this.props.comment.id} data-article-id={this.props.articleId} className="moya__delete_link" onClick={this.deleteComment}>[削除]</button> :
      null
    const content = remarkProcessor.processSync(this.props.comment.message).contents

    return (
      <div className="moya__comment">
        <div className="moya__comment__header">
          <div className="moya__comment__title">{this.props.comment.displayName}</div>
          <div className="moya__comment__datetime">
            {created}
            {deleteButton}
          </div>
        </div>
        <div className="moya__comment__content">
          <div className="moya__comment__content__body">
            <ExpandCollapse
              previewHeight="320px"
              expandText="続きを読む"
              collapseText="閉じる"
              ellipsis={false}
            >
              {content}
            </ExpandCollapse>
          </div>
        </div>
      </div>
    )
  }
}

export default Comment
