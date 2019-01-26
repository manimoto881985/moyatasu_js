import React from 'react'
import Article from '../Article/Article'

const ArticleList = ({
  articles,
  deleteArticle, addComment, deleteComment, handleChange,
  state, stateMeUid, stateMe
}) => {
  const articlesLength = articles.length;

  return (
    articles.reverse().map((article, index) => {
      return (
        <Article
          key={article.id}
          article={article}
          articlesLength={articlesLength}
          index={index}
          deleteArticle={deleteArticle}
          addComment={addComment}
          deleteComment={deleteComment}
          handleChange={handleChange}
          stateMeUid={stateMeUid}
          stateMe={stateMe}
          stateComment={state[`comment-${article.id}`]}
        />
      )
    })
  )
}

export default ArticleList
