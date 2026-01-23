document.querySelectorAll(".approve").forEach(btn => {
  btn.onclick = () => {
    const row = btn.closest("tr");
    row.querySelector(".badge").textContent = "Approved";
    row.querySelector(".badge").style.background = "#dcfce7";
    row.querySelector(".badge").style.color = "#166534";
  };
});

document.querySelectorAll(".reject").forEach(btn => {
  btn.onclick = () => {
    const row = btn.closest("tr");
    row.querySelector(".badge").textContent = "Rejected";
    row.querySelector(".badge").style.background = "#fee2e2";
    row.querySelector(".badge").style.color = "#991b1b";
  };
});

document.querySelectorAll(".delete").forEach(btn => {
  btn.onclick = () => {
    if (confirm("Delete this content permanently?")) {
      btn.closest("tr").remove();
    }
  };
});
