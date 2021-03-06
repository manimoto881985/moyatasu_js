import React from 'react'
import DayJS from 'dayjs';
import remark from 'remark'
import reactRenderer from 'remark-react'
import remarkBreaks from 'remark-breaks'
import remarkExternalLinks from 'remark-external-links'
import ExpandCollapse from 'react-expand-collapse';
import CommentList from '../Comment/CommentList'
import CommentForm from '../Comment/CommentForm'
import {db} from '../../js/firebase';

const remarkProcessor = remark().use(reactRenderer).use(remarkBreaks).use(remarkExternalLinks);
const dbCollectionArticles = db.collection("messages");

class Article extends React.Component {
  deleteArticle = (e) => {
    if(window.confirm('本当に削除しますか？')){
      dbCollectionArticles.doc(e.target.value).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removeing document: ", error);
      });
    }
  }

  render() {
    const article = this.props.article;
    const articlesLength = this.props.articlesLength;
    const index = this.props.index;
    const stateMe = this.props.stateMe;

    const imageIndex = ((articlesLength - index) % 45) + 1;
    const imagePath = `images/${imageIndex}.gif`;
    const created = article.created ?
      DayJS.unix(article.created.seconds).format('YYYY-MM-DD HH:mm:ss') :
      DayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const deleteButton = article.uid === stateMe.uid ?
      <button value={article.id} className="moya__delete_link" onClick={this.deleteArticle}>[削除]</button> :
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
            <ExpandCollapse
              previewHeight="480px"
              expandText="続きを読む"
              collapseText="閉じる"
              ellipsis={false}
            >
              {content}
            </ExpandCollapse>
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
            stateMe={stateMe}
          />
          <CommentForm
            article={article}
            stateMe={stateMe}
          />
        </div>
      </div>
    )
  }
}

export default Article
