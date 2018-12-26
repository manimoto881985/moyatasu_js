import React from 'react'
import Textarea from 'react-textarea-autosize';

const CommentForm = ({
  article,
  addComment, handleChange,
  stateComment
}) => {
  const name = `comment-${article.id}`

  return (
    <form autoComplete="off" className="moya__comment__form" onSubmit={addComment}>
      <Textarea
        minRows={1}
        id="message"
        className="moya_comment_message"
        placeholder="コメントを追加..."
        onChange={handleChange}
        name={name}
        value={stateComment}
      />
      <div className="moya__comment__form__submit">
        <button type="submit" data-article-id={article.id} onClick={addComment}>Submit</button>
      </div>
    </form>
  )
}

export default CommentForm
