import React from 'react'
import Comment from '../Comment/Comment'

const CommentList = ({
  comments, articleId,
  deleteComment,
  stateMeUid
}) => (
  <div>
    {comments.map(comment =>
      <Comment
        key={comment.id}
        comment={comment}
        articleId={articleId}
        deleteComment={deleteComment}
        stateMeUid={stateMeUid}
      />
    )}
  </div>
)

export default CommentList
