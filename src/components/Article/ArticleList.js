import React from 'react'
import Article from '../Article/Article'

const ArticleList = ({
  articles,
  stateMe
}) => {
  const articlesLength = articles.length;

  return (
    articles.map((article, index) => {
      return (
        <Article
          key={article.id}
          article={article}
          articlesLength={articlesLength}
          index={index}
          stateMe={stateMe}
        />
      )
    })
  )
}

export default ArticleList
