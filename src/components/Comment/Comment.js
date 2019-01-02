import React from 'react'
import DayJS from 'dayjs';
import remark from 'remark'
import reactRenderer from 'remark-react'
import remarkBreaks from 'remark-breaks'
import remarkExternalLinks from 'remark-external-links'
import ExpandCollapse from 'react-expand-collapse';
const remarkProcessor = remark().use(reactRenderer).use(remarkBreaks).use(remarkExternalLinks);

const Comment = ({
  comment, articleId,
  deleteComment,
  stateMeUid
}) => {
  const created = comment.created ?
    DayJS.unix(comment.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
    DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const deleteButton = comment.uid === stateMeUid ?
    <button value={comment.id} data-article-id={articleId} className="moya__delete_link" onClick={deleteComment}>[削除]</button> :
    null
  const content = remarkProcessor.processSync(comment.message).contents

  return (
    <div className="moya__comment">
      <div className="moya__comment__header">
        <div className="moya__comment__title">{comment.displayName}</div>
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

export default Comment
