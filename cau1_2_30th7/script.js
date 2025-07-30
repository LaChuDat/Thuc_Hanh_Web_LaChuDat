// script.js
import { transactions } from "./data.js";

let nextId = Math.max(...transactions.map(t => t.id)) + 1;
const tbody      = document.querySelector("#txnTable tbody");
const selectAll  = document.getElementById("selectAll");
const btnAdd     = document.querySelector("[data-bs-target='#formModal']");
const btnSave    = document.getElementById("btnSaveTxn");
const btnDelete  = document.getElementById("btnDeleteSelected");
const form       = document.getElementById("txnForm");
const bsModal    = new bootstrap.Modal(document.getElementById("formModal"));
const inpCust    = document.getElementById("cust");
const inpStaff   = document.getElementById("staff");
const inpAmount  = document.getElementById("amount");
function renderTable() {
  tbody.innerHTML = "";
  transactions.forEach(txn => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" data-id="${txn.id}"></td>
      <td class="text-nowrap">
        <i class="bi bi-x-circle-fill text-danger me-2 delete-icon" data-id="${txn.id}"></i>
        <i class="bi bi-eye-fill text-primary me-2"></i>
        <i class="bi bi-pencil-fill text-warning"></i>
      </td>
      <td>${txn.id}</td>
      <td>${txn.khachHang}</td>
      <td>${txn.nhanVien}</td>
      <td>${txn.soTien.toLocaleString()}</td>
      <td>${txn.ngayMua}</td>
    `;
    tbody.appendChild(tr);
  });
}
btnAdd.addEventListener("click", () => {
  form.reset();
  form.classList.remove("was-validated");
  bsModal.show();
});
btnSave.addEventListener("click", () => {
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  const cust  = inpCust.value.trim();
  const staff = inpStaff.value.trim();
  let invalid = false;

  if (cust.length > 30) {
    inpCust.setCustomValidity("tooLong");
    inpCust.nextElementSibling.textContent = "Khách hàng tối đa 30 ký tự.";
    invalid = true;
  } else inpCust.setCustomValidity("");

  if (staff.length > 30) {
    inpStaff.setCustomValidity("tooLong");
    inpStaff.nextElementSibling.textContent = "Nhân viên tối đa 30 ký tự.";
    invalid = true;
  } else inpStaff.setCustomValidity("");

  if (invalid) {
    form.reportValidity();
    return;
  }

  const now = new Date();
  const dateStr = `${now.getDate()} Tháng ${now.getMonth()+1} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2,"0")}`;

  transactions.push({ id: nextId++, khachHang: cust, nhanVien: staff, soTien: Number(inpAmount.value), ngayMua: dateStr });
  renderTable();
  bsModal.hide();
});
tbody.addEventListener("click", e => {
  if (e.target.classList.contains("delete-icon")) {
    const id = +e.target.dataset.id;
    transactions.splice(transactions.findIndex(t=>t.id===id),1);
    renderTable();
  }
});

selectAll.addEventListener("change", () => {
  tbody.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = selectAll.checked);
});

btnDelete.addEventListener("click", () => {
  tbody.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
    const id = +cb.dataset.id;
    transactions.splice(transactions.findIndex(t=>t.id===id),1);
  });
  renderTable();
});

renderTable();
