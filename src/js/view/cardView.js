class CardView {
   _parentElement;
   _headerElement;

   constructor(parentEl, headerEl) {
      this._parentElement = document.querySelector(parentEl);
      this._headerElement = document.querySelector(headerEl);
   }

   addHandlerCardClick(selectHandler, openHandler) {
      let timer;

      this._parentElement.addEventListener('click', (e) => {
         clearTimeout(timer);

         timer = setTimeout(() => {
            selectHandler(e);
         }, 180);
      });

      this._parentElement.addEventListener('dblclick', (e) => {
         clearTimeout(timer);

         const article = e.target.closest('article');
         openHandler(article.dataset.id, article.dataset.type);
      });
   }

   addHandlerDelete(handler) {
      this._headerElement.addEventListener('click', (e) => {
         if (e.target.className === 'btn delete-btn') {
            e.preventDefault();
            handler();
         }
      });
   }

   addHandlerBtnDelete(handler) {
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Delete') {
            handler();
         }
      });
   }
}

export default CardView;
