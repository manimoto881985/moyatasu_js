import React from 'react'
import Comment from '../Comment/Comment'

const CommentList = ({
  comments, articleId,
  stateMe
}) => (
  <div>
    {comments.map(comment =>
      <Comment
        key={comment.id}
        comment={comment}
        articleId={articleId}
        stateMe={stateMe}
      />
    )}
  </div>
)

export default CommentList
