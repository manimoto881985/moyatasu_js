import React from 'react'
import DayJS from 'dayjs';
import remark from 'remark'
import reactRenderer from 'remark-react'
import remarkBreaks from 'remark-breaks'
import remarkExternalLinks from 'remark-external-links'
import CommentList from '../Comment/CommentList'
import CommentForm from '../Comment/CommentForm'

const remarkProcessor = remark().use(reactRenderer).use(remarkBreaks).use(remarkExternalLinks);

const Article = ({
  article, articlesLength, index,
  deleteArticle, addComment, deleteComment, handleChange,
  stateMeUid, stateComment
}) => {
  const imageIndex = ((articlesLength - index) % 45) + 1;
  const imagePath = `images/${imageIndex}.gif`;
  const created = article.created ?
    DayJS.unix(article.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
    DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const deleteButton = article.uid === stateMeUid ?
    <button value={article.id} className="moya__delete_link" onClick={deleteArticle}>[削除]</button> :
    null
  const content = remarkProcessor.processSync(article.message).contents

  return (
    <div key={index} className="nes-container is-dark with-title moya__article">
      <div className="title moya__title">
        {article.displayName}
      </div>
      <div className="moya__content">
        <div className="moya__user_image_container">
          <img src={imagePath} className="moya__user_image" alt="icon"/>
        </div>
        <div className="moya__content_text">
          <div>
            {content}
          </div>
          <div className="moya__datetime">
            {created}
            {deleteButton}
          </div>
        </div>
      </div>
      <div className="moya__comments">
        <CommentList
          comments={article.comments}
          articleId={article.id}
          deleteComment={deleteComment}
          stateMeUid={stateMeUid}
        />
        <CommentForm
          article={article}
          addComment={addComment}
          handleChange={handleChange}
          stateComment={stateComment}
        />
      </div>
    </div>
  )
}

export default Article
