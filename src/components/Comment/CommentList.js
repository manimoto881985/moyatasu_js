import React from 'react'
import Comment from '../Comment/Comment'

const CommentList = ({
  comments, articleId,
  deleteComment,
  stateMe
}) => (
  <div>
    {comments.map(comment =>
      <Comment
        key={comment.id}
        comment={comment}
        articleId={articleId}
        deleteComment={deleteComment}
        stateMe={stateMe}
      />
    )}
  </div>
)

export default CommentList
