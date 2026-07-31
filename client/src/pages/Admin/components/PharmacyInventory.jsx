import { inventory } from "../data/dashboard";
import { Button, Card, ProgressBar } from "./common";

function PharmacyInventory() {
  return (
    <Card>
      <h4 className="section-title">Pharmacy Inventory</h4>
      <div className="inventory-list">
        {inventory.map((item) => (
          <div className="inventory-item" key={item.id}>
            <div className="inventory-heading">
              <span>{item.name}</span>
              <span className={item.tone}>{item.label}</span>
            </div>
            <ProgressBar
              className={item.tone === "danger" ? "danger" : ""}
              value={item.value}
            />
          </div>
        ))}
        <Button variant="secondary">Reorder Essentials</Button>
      </div>
    </Card>
  );
}

export default PharmacyInventory;
