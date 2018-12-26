import React from 'react'
import Textarea from 'react-textarea-autosize';

const ArticleForm = ({
  addArticle, handleChange,
  stateArticle
}) => {
  return (
    <form autoComplete="off" className="moya__form" onSubmit={addArticle}>
      <Textarea
        minRows={3}
        id="article"
        className="moya__article__textarea"
        placeholder="最近の出来事を共有..."
        onChange={handleChange}
        name="article"
        value={stateArticle}
      />
      <div className="moya__form__submit">
        <button type="submit" id="submit" onClick={addArticle}>Submit</button>
      </div>
    </form>
  )
}

export default ArticleForm
