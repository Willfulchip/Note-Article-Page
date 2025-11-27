class View {
   _parentElement;
   _type;

   constructor(parentEl, type) {
      this._parentElement = document.querySelector(parentEl);
      this._type = type;
   }

   render(data, selected) {
      this._parentElement.innerHTML = '';
      this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkUp(data, selected));
   }

   update(data, selected) {
      const newMarkUp = this._generateMarkUp(data, selected);
      const newDom = document.createRange().createContextualFragment(newMarkUp);
      const newElements = Array.from(newDom.querySelectorAll('article'));

      const curElements = Array.from(this._parentElement.querySelectorAll('article'));

      const roster = new Map();

      curElements.forEach((curEl) => {
         roster.set(curEl.dataset.id, curEl);
      });

      newElements.forEach((newEl) => {
         const id = newEl.dataset.id;
         const oldEl = roster.get(id);

         if (oldEl) {
            roster.delete(id);

            if (newEl.isEqualNode(oldEl)) {
               return;
            }

            Array.from(newEl.attributes).forEach((attr) => {
               oldEl.setAttribute(attr.name, attr.value);
            });

            oldEl.innerHTML = newEl.innerHTML;
         } else {
            this._parentElement.prepend(newEl);
         }
      });

      roster.forEach((elToRemove) => {
         elToRemove.remove();
      });
   }

   _generateMarkUp(data, selected) {
      const markUp = data
         .map((el) => {
            return `
                     <article class="${selected.has(String(el.id)) ? 'selected' : ''}" data-type="${this._type}" data-id="${el.id}">
                        <h3>${el.date}</h3>
                        <p>${el.content}</p>
                     </article>
                  `;
         })
         .join('');

      return markUp;
   }
}

export default View;
