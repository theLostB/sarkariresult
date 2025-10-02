import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function NotificationPermissionModal({ open, onAllow, onDeny }: { open: boolean; onAllow: () => void; onDeny: () => void }) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Allow Notifications?</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-gray-700 text-base">
          Stay updated! Get instant notifications on your device when new jobs, results, or admit cards are posted. You can turn this off anytime.
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <button onClick={onDeny} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium">Not Now</button>
          <button onClick={onAllow} className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold">Allow</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
