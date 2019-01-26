import React from 'react'
import Article from '../Article/Article'

const ArticleList = ({
  articles,
  deleteArticle,
  state, stateMe
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
          stateMe={stateMe}
        />
      )
    })
  )
}

export default ArticleList
