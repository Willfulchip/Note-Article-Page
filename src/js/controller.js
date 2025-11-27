import * as modal from './model.js';
import View from './view/View.js';
import modalView from './view/modalView.js';
import CardView from './view/cardView.js';

let currentType = '';
const noteView = new View('.notes-display', 'note');
const articleView = new View('.articles-display', 'article');
const noteCardView = new CardView('.notes-display', '.notes-header');
const articleCardView = new CardView('.articles-display', '.articles-header');
const noteLabel = 'Write down what u watch in those days and ur feelings';
const articleLabel = 'Write down the bug and the solutions or ur thoughts';

function controlData() {
   noteView.render(modal.state.notes, modal.state.noteSelected);
   articleView.render(modal.state.articles, modal.state.articleSelected);
}

function controlOpenModal(e) {
   if (e.currentTarget.id === 'note-btn') {
      currentType = 'notes';
      modalView.openModal(noteLabel, modal.loadDraft(currentType));
   } else {
      currentType = 'articles';
      modalView.openModal(articleLabel, modal.loadDraft(currentType));
   }
}

function controlCloseModal() {
   modalView.closeModal();
}

function controlAddData(content) {
   modal.addData(content, currentType);
   if (currentType === 'notes') {
      noteView.render(modal.state.notes, modal.state.noteSelected);
   } else {
      articleView.render(modal.state.articles, modal.state.articleSelected);
   }

   modalView.closeModal();
}

function controlSelectArticle(e) {
   const card = e.target.closest('article');
   if (!card) {
      return;
   }

   modal.toggleSelected(card.dataset.type, card.dataset.id);

   if (card.dataset.type === 'note') {
      noteView.update(modal.state.notes, modal.state.noteSelected);
   }

   if (card.dataset.type === 'article') {
      articleView.update(modal.state.articles, modal.state.articleSelected);
   }
}

function controlDeleteSelected() {
   if (modal.state.noteSelected.size > 0) {
      modal.deleteData('note');
      noteView.render(modal.state.notes, modal.state.noteSelected);
   }

   if (modal.state.articleSelected.size > 0) {
      modal.deleteData('article');
      articleView.render(modal.state.articles, modal.state.articleSelected);
   }
}

function controlSaveDraft(content) {
   modal.saveDraft(content, currentType);
}

function debounce(func, delay) {
   let timerId;

   return function (...args) {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
         func.apply(this, args);
      }, delay * 1000);
   };
}

function controlOpenArticle(id, type) {
   const data = modal.getDataById(id, type);
   if (type === 'note') {
      modalView.openModal(noteLabel, data.content);
   } else {
      modalView.openModal(articleLabel, data.content);
   }
}

export function init() {
   controlData();

   modalView.addHandlerOpenModal(controlOpenModal);
   modalView.addHandlerCloseModal(controlCloseModal);
   modalView.addHandlerSubmit(controlAddData);
   modalView.addHandlerChange(debounce(controlSaveDraft, 1.5));

   noteCardView.addHandlerDelete(controlDeleteSelected);
   noteCardView.addHandlerBtnDelete(controlDeleteSelected);
   noteCardView.addHandlerCardClick(controlSelectArticle, controlOpenArticle);

   articleCardView.addHandlerDelete(controlDeleteSelected);
   articleCardView.addHandlerBtnDelete(controlDeleteSelected);
   articleCardView.addHandlerCardClick(controlSelectArticle, controlOpenArticle);
}
