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
    try {
      if (!("Notification" in window) || !navigator.serviceWorker) {
        alert("Your browser does not support notifications.");
        return;
      }

      const permissionStatus = await navigator.permissions.query({
        name: "notifications" as PermissionName,
      });

      if (permissionStatus.state === "granted") {
        setNotifications(true);
        router.push("/tracking/traffic");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setNotifications(true);

        router.push("/tracking/traffic");

        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        await registration.showNotification("Notifications Enabled", {
          body: "You will now receive updates about nearby museums!",
          icon: "/icons/cellphone-art.png",
        });
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
    } catch (error) {
      console.error("An error occurred while enabling notifications:", error);
      alert("An error occurred. Please try again later.");
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
