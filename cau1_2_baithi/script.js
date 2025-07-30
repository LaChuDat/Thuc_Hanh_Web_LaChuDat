
document.addEventListener("DOMContentLoaded", () => {
  const tbody        = document.querySelector("#dataTable tbody");
  const form         = document.getElementById("recordForm");
  const modalEl      = document.getElementById("formModal");
  const bsModal      = new bootstrap.Modal(modalEl);
  function renderTable() {
    tbody.innerHTML = "";
    records.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${r.address}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  renderTable();
  form.addEventListener("submit", e => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const phoneVal = form.phone.value.trim();
    if (!/^0\d{9}$/.test(phoneVal)) {
      form.phone.classList.add("is-invalid");
      return;
    }
    records.push({
      id: records.length + 1,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: phoneVal,
      address: form.address.value.trim()
    });
    renderTable();

    form.reset();
    form.classList.remove("was-validated");
    bsModal.hide();
  });
  modalEl.addEventListener("show.bs.modal", () => {
    form.classList.remove("was-validated");
    form.querySelectorAll(".is-invalid").forEach(i => i.classList.remove("is-invalid"));
  });
});
