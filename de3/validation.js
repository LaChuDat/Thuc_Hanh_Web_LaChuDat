document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".needs-validation");
  const nameInput = document.getElementById("mName");
  const lastInput = document.getElementById("mLast");
  const addrInput = document.getElementById("mAddr");

  const rules = {
    mName: { label: "Tên", max: 15 },
    mLast: { label: "Họ đệm", max: 20 },
    mAddr: { label: "Địa chỉ", max: 50 },
  };

  const updateCounter = (el) => {
    const max = parseInt(el.getAttribute("maxlength"), 10) || 0;
    const counter = document.querySelector(`.char-count[data-for="${el.id}"]`);
    if (counter && max) counter.textContent = `${el.value.length}/${max}`;
  };

  const setError = (input, message) => {
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = message;
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  };

  const setValid = (input) => {
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = "";
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  };

  const validateField = (input) => {
    const { label, max } = rules[input.id];
    const value = input.value.trim();
    if (!value) {
      setError(input, `${label} không được bỏ trống.`);
      return false;
    }
    if (value.length > max) {
      setError(input, `${label} tối đa ${max} ký tự.`);
      return false;
    }
    setValid(input);
    return true;
  };

  [nameInput, lastInput, addrInput].forEach((el) => {
    updateCounter(el);
    el.addEventListener("input", () => {
      updateCounter(el);
      if (form.classList.contains("was-validated") || el.classList.contains("is-invalid")) {
        validateField(el);
      }
    });
    el.addEventListener("blur", () => validateField(el));
  });

  form.addEventListener("submit", (event) => {
    const v1 = validateField(nameInput);
    const v2 = validateField(lastInput);
    const v3 = validateField(addrInput);
    const isValid = v1 && v2 && v3;
    if (!isValid) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  });

  const modalEl = document.getElementById("formModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => {
      form.classList.remove("was-validated");
      [nameInput, lastInput, addrInput].forEach((el) => {
        el.value = "";
        el.classList.remove("is-valid", "is-invalid");
        const fb = el.parentElement.querySelector(".invalid-feedback");
        if (fb) fb.textContent = "";
        updateCounter(el);
      });
    });
  }
});
