const { useState, useMemo } = React;

const RULES = {
  firstName: { label: "Tên",     max: 15 },
  lastName:  { label: "Họ đệm",  max: 20 },
  address:   { label: "Địa chỉ", max: 50 },
};

function EmployeeForm({ onAdd }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", address: "", active: true });
  const [errors, setErrors] = useState({});

  const counts = {
    firstName: `${form.firstName.length}/${RULES.firstName.max}`,
    lastName:  `${form.lastName.length}/${RULES.lastName.max}`,
    address:   `${form.address.length}/${RULES.address.max}`,
  };

  const validateField = (name, value) => {
    const rule = RULES[name];
    if (!rule) return "";
    const v = (value ?? "").trim();
    if (!v) return `${rule.label} không được bỏ trống.`;
    if (v.length > rule.max) return `${rule.label} tối đa ${rule.max} ký tự.`;
    return "";
  };

  const validateAll = () => {
    const newErr = {};
    Object.keys(RULES).forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) newErr[k] = msg;
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: v }));
    if (RULES[name]) {
      const msg = validateField(name, v);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    onAdd(form);
    setForm({ firstName: "", lastName: "", address: "", active: true });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="border rounded p-3 bg-light">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Tên</label>
          <input
            name="firstName"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            value={form.firstName}
            maxLength={RULES.firstName.max}
            onChange={handleChange}
            placeholder="Ví dụ: Mai"
            required
          />
          <div className="invalid-feedback">{errors.firstName}</div>
          <small className="text-muted char-count">{counts.firstName}</small>
        </div>

        <div className="col-md-4">
          <label className="form-label">Họ đệm</label>
          <input
            name="lastName"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            value={form.lastName}
            maxLength={RULES.lastName.max}
            onChange={handleChange}
            placeholder="Ví dụ: Thục Anh"
            required
          />
          <div className="invalid-feedback">{errors.lastName}</div>
          <small className="text-muted char-count">{counts.lastName}</small>
        </div>

        <div className="col-md-4">
          <label className="form-label">Địa chỉ</label>
          <input
            name="address"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={form.address}
            maxLength={RULES.address.max}
            onChange={handleChange}
            placeholder="Ví dụ: 175 Tây Sơn, Hà Nội"
            required
          />
          <div className="invalid-feedback">{errors.address}</div>
          <small className="text-muted char-count">{counts.address}</small>
        </div>

        <div className="col-md-4 d-flex align-items-center">
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="activeCheck"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="activeCheck">
              Hoạt động
            </label>
          </div>
        </div>

        <div className="col-12">
          <button className="btn btn-success"><i className="bi bi-plus-lg"></i> Thêm</button>
        </div>
      </div>
    </form>
  );
}

function EmployeeTable({ data }) {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>Hành động</th>
            <th>STT</th>
            <th>Tên</th>
            <th>Họ đệm</th>
            <th>Địa chỉ</th>
            <th>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="6" className="text-center text-muted">Chưa có dữ liệu</td></tr>
          ) : (
            data.map((emp, idx) => (
              <tr key={emp.id}>
                <td>
                  <button className="btn btn-sm btn-primary me-1" title="Xem"><i className="bi bi-eye-fill"></i></button>
                  <button className="btn btn-sm btn-warning me-1" title="Sửa"><i className="bi bi-pencil-fill"></i></button>
                  <button className="btn btn-sm btn-danger" title="Xoá"><i className="bi bi-trash-fill"></i></button>
                </td>
                <td>{idx + 1}</td>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.address}</td>
                <td>
                  {emp.active ? (
                    <i className="bi bi-check-circle-fill text-success"></i>
                  ) : (
                    <i className="bi bi-x-circle-fill text-danger"></i>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="text-end">Kết quả 1 đến {data.length}</p>
    </div>
  );
}

function App() {
  const [rows, setRows] = useState(() => window.employees ?? []);
  const nextId = useMemo(
    () => (rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1),
    [rows]
  );

  const handleAdd = (payload) => {
    const newEmp = { id: nextId, ...payload };
    setRows(prev => [...prev, newEmp]);
  };

  return (
    <>
      <EmployeeForm onAdd={handleAdd} />
      <EmployeeTable data={rows} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("react-root")).render(<App />);

