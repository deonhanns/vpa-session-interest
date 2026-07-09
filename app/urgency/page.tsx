import UrgencyBanner from "@/components/UrgencyBanner";

export default function UrgencyPage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "16px",
      background: "transparent",
    }}>
      <UrgencyBanner variant="standalone" />
    </div>
  );
}
