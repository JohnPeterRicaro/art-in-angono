"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";

const Notifications = () => {
  const router = useRouter();
  const { setNotifications } = useTrackingContainerStore();

  const handleEnableNotifications = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      showNotification("Notifications Enabled", {
        body: "You will now receive updates about nearby museums!",
        icon: "/icons/cellphone-art.png",
      });
      setNotifications(true);
      router.push("/tracking/traffic");
    } else if (permission === "denied") {
      alert(
        "Notifications permission is blocked. Please enable notifications in your browser settings if you want to receive updates."
      );
      setNotifications(false);
      router.push("/tracking");
    } else {
      alert("Please grant permission to enable notifications.");
      router.push("/tracking");
    }
  };

  const showNotification = (title: string, options: NotificationOptions) => {
    if ("Notification" in window) {
      new Notification(title, options);
    } else {
      console.error("Browser does not support notifications.");
    }
  };

  return (
    <ContentContainer className={"bg-white"}>
      <DynamicContent
        heading={"Enable Notifications"}
        subheading={
          "This lets us show you which museums in Rizal are currently near you."
        }
        image={"/icons/cellphone-art.png"}
        imageFallback={"/icons/cellphone-art.png"}
      >
        <Button
          onClick={() => handleEnableNotifications()}
          type={"button"}
          variant={"default"}
          className={
            "w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Enable Notifications
        </Button>
        <Button
          type={"button"}
          onClick={() => router.push("/tracking")}
          variant={"outline"}
          className={
            "w-full h-auto py-[18px] text-[20px] font-semibold rounded-[33px]"
          }
        >
          Skip for now
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default Notifications;
