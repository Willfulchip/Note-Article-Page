export const state = {
   notes: [],
   articles: [],
   noteSelected: new Set(),
   articleSelected: new Set(),
   drafts: {
      noteDraft: '',
      articleDraft: '',
   },
};

function loadData() {
   try {
      if (localStorage.getItem('notes')) {
         state.notes = JSON.parse(localStorage.getItem('notes'));
      }
      if (localStorage.getItem('articles')) {
         state.articles = JSON.parse(localStorage.getItem('articles'));
      }
   } catch (err) {
      console.error(err);
   }
}

function persistData() {
   try {
      localStorage.setItem('notes', JSON.stringify(state.notes));
      localStorage.setItem('articles', JSON.stringify(state.articles));
   } catch (err) {
      console.error("Error saving data:", err);
   }
}

function persistDraft() {
   try {
      localStorage.setItem('drafts', JSON.stringify(state.drafts));
   } catch (err) {
      console.error("Error saving drafts:", err);
   }
}

export function addData(content, type) {
   const formatter = new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });

   const newData = {
      id: Date.now(),
      date: formatter.format(new Date()),
      content: content,
   };

   if (type === 'notes') {
      state.notes.unshift(newData);
      state.drafts.noteDraft = '';
   } else {
      state.articles.unshift(newData);
      state.drafts.articleDraft = '';
   }

   persistData();
   persistDraft();
   console.log('submit success');
}

export function deleteData(type) {
   if (type === 'note') {
      const toKeep = state.notes.filter((note) => !state.noteSelected.has(String(note.id)));

      state.notes = toKeep;

      state.noteSelected.clear();
   } else if (type === 'article') {
      const toKeep = state.articles.filter(
         (article) => !state.articleSelected.has(String(article.id)),
      );

      state.articles = toKeep;

      state.articleSelected.clear();
   }
   persistData();
}

export function getDataById(id, type) {
   if (type === 'note') {
      return state.notes.find((el) => String(el.id) === id);
   } else if (type === 'article') {
      return state.articles.find((el) => String(el.id) === id);
   }
}

export function toggleSelected(type, id) {
   if (type === 'note') {
      if (state.noteSelected.has(id)) {
         state.noteSelected.delete(id);
      } else {
         state.noteSelected.add(id);
      }
   } else if (type === 'article') {
      if (state.articleSelected.has(id)) {
         state.articleSelected.delete(id);
      } else {
         state.articleSelected.add(id);
      }
   }
}

export function saveDraft(content, type) {
   if (type === 'notes') {
      state.drafts.noteDraft = content;
   } else if (type === 'articles') {
      state.drafts.articleDraft = content;
   }

   persistDraft();
}

export function loadDraft(type) {
   if (type === 'notes') {
      return state.drafts.noteDraft;
   } else if (type === 'articles') {
      return state.drafts.articleDraft;
   }
}

function init() {
   try {
      const drafts = localStorage.getItem('drafts');
      if (drafts) {
         state.drafts = JSON.parse(drafts);
      }
   } catch (err) {
      console.error("Error loading drafts:", err);
      // Reset to default state if corrupted
      state.drafts = {
         noteDraft: '',
         articleDraft: '',
      };
   }
}

init();
loadData();
