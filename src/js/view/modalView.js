import EasyMDE from 'easymde';

class ModalView {
   _parentElement;
   _formElement;
   _textarea;
   _openModalBtn;
   _contentLabel;
   _closeModalBtn;
   _finishBtn;
   _easyMdeInstance;
   _articles;
   _changeHandler;

   constructor() {
      this._parentElement = document.querySelector('.writing-container');
      this._formElement = document.querySelector('form');
      this._textarea = document.querySelector('.content-input');
      this._contentLabel = document.getElementById('writing-label');
      this._openModalBtn = document.querySelectorAll('.writing-btn');
      this._closeModalBtn = document.querySelector('.close-btn');
      this._finishBtn = document.querySelector('.finish-btn');
      this._articles = document.querySelectorAll('article');

      this._easyMdeInstance = null;
   }

   openModal(labelContent, draft) {
      this._contentLabel.textContent = labelContent;
      this._parentElement.classList.remove('hidden');

      // Clean up existing instance if it exists
      if (this._easyMdeInstance) {
         this._easyMdeInstance.toTextArea();
         this._easyMdeInstance = null;
      }

      this._easyMdeInstance = new EasyMDE({
         element: document.querySelector('.content-input'),
         uploadImage: true,
         initialValue: draft || '',
         /* renderingConfig: {
            codeSyntaxHighlighting: true,
         }, */
         maxHeight: '300px',
      });

      this._easyMdeInstance.codemirror.on('changes', (instance) => {
         if (this._changeHandler) {
            this._changeHandler(instance.getValue());
         }
      });
   }

   closeModal() {
      this._parentElement.classList.add('hidden');

      if (this._easyMdeInstance) {
         this._easyMdeInstance.toTextArea();
         this._easyMdeInstance = null;
      }

      this._textarea.value = '';
   }

   addHandlerOpenModal(handler) {
      this._openModalBtn.forEach((btn) => {
         btn.addEventListener('click', (e) => {
            handler(e);
         });
      });
   }

   addHandlerCloseModal(handler) {
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape') {
            e.preventDefault();
            handler();
         }
      });
      this._closeModalBtn.addEventListener('click', (e) => {
         e.preventDefault();
         handler();
      });
   }

   addHandlerSubmit(handler) {
      this._formElement.addEventListener('submit', (e) => {
         e.preventDefault();
         handler(this._easyMdeInstance.value());
      });
   }

   addHandlerChange(handler) {
      this._changeHandler = handler;
   }
}

export default new ModalView();
