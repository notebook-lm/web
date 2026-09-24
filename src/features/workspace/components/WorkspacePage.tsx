import { Sparkles } from "lucide-react";
import { PageHeader } from "@/shared/components";
import { useAuthSession } from "@/features/authentication";

export function WorkspacePage() {
  const { user } = useAuthSession();
  return (
    <section>
      <PageHeader
        eyebrow={
          <>
            <Sparkles size={15} />
            Your research space
          </>
        }
        title={
          <>
            Good evening, <em>{user?.displayName?.split(" ")[0]}.</em>
          </>
        }
        description="Your workspace is ready whenever your next idea arrives."
      />
    </section>
  );
}
