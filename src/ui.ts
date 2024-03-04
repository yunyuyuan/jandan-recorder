import { getList, updateStorage } from './storage';
import './style.scss';

const ModalId = 'jandan-recorder-modal';

export function initUI () {
  const container = $('#header .nav-items .nav-item:last-of-type');
  const myPost = $('<a/>');
  myPost.addClass('nav-link jandan-record-link')
  myPost.text('我的吐槽');
  myPost.appendTo(container);
  
  const modalContainer = $('<div/>', {id: ModalId});
  
  const modalInner = $('<div/>', {class: 'inner'});
  
  const tableContainer = $('<div/>', {class: 'table-container'});
  
  const table = $('<table>');

  const headers = ['日期', '类型', '内容', '网址', '操作'];
  const headerEl = $('<thead>');
  const headerRow = $('<tr>');
  headers.forEach(function(header) {
    headerRow.append($('<th>').text(header));
  });
  headerEl.append(headerRow);

  table.append(headerEl);
  table.append($('<tbody>'));

  modalInner.append(tableContainer.append(table));
  
  modalContainer.append(modalInner);
  $('body').append(modalContainer);
  
  modalContainer.on("mousedown", () => {
    modalContainer.css('display', 'none');
  });
  modalInner.on("mousedown", (e) => {
    e.stopPropagation();
  })

  myPost.on('click', () => {
    modalContainer.css('display', 'block');
    renderList();
  })
}
  
export function renderList() {
  const list = getList();
  
  const bodyEl = $(`#${ModalId} tbody`);
  bodyEl.empty();
  if (list.length > 0) {
    list.forEach(function(item, idx) {
      const row = $('<tr>');
      row.append($('<td>').text(new Date(item.timestamp).toLocaleString()));
      row.append($('<td>').text(item.isCreate ? '自己创建' : '评论吐槽'));
      row.append($('<td>').text(item.content));
      
      const urlCell = $('<td>');
      const link = $('<a>').attr('href', item.url).attr('target', '_blank').text('点击前往');
      urlCell.append(link);
      row.append(urlCell);

      row.append($('<td>').append($('<button>').text('删除').on('click', () => {
        list.splice(idx, 1);
        updateStorage();
        renderList();
      })));

      bodyEl.append(row);
    });
  } else {
    bodyEl.text('一条都没有，赶快去吐槽吧！');
  }
}