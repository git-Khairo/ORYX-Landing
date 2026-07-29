"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Opening } from "@/components/chrome/Opening";
import { Nav } from "@/components/chrome/Nav";
import { JourneyRail } from "@/components/chrome/JourneyRail";
import { SceneTracker } from "@/components/chrome/SceneTracker";
import { Hero } from "@/components/scenes/Hero";
import { Standard } from "@/components/scenes/Standard";
import { Process } from "@/components/scenes/Process";
import { Contact } from "@/components/scenes/Contact";
import { ServiceSelector } from "@/components/services/ServiceSelector";
import { ServiceWorld } from "@/components/services/ServiceWorld";
import { ContactGateway } from "@/components/contact/ContactGateway";
import { SERVICES, serviceById, type ServiceId } from "@/lib/content";
import { useExperience } from "@/lib/store";
import { usePager } from "@/lib/pager";
import { Particles } from "@/components/art/Particles";

const isServiceId = (v: string): v is ServiceId =>
  SERVICES.some((s) => s.id === v);

/**
 * The single page experience.
 *
 * Expanding a service is a state change, never a route. The hash
 * carries it so a link can open a world and the browser back action
 * closes it, while the page underneath is never unmounted or
 * re-rendered from scratch.
 */
export function Experience() {
  const activeService = useExperience((s) => s.activeService);
  const openService = useExperience((s) => s.openService);
  const closeService = useExperience((s) => s.closeService);

  /* One gesture moves one scene, on desktop, with a real eased
     transition. Touch keeps native scrolling with CSS proximity snap. */
  usePager();

  /* True only when this session pushed the entry, so a visitor who
     arrived on a deep link is never sent back off the site. */
  const pushed = useRef(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (isServiceId(hash)) {
      // Land on the selector so closing returns to the right place.
      document.getElementById("services")?.scrollIntoView({ block: "start" });
      openService(hash);
    }

    const onPop = () => {
      const next = window.location.hash.replace("#", "");
      pushed.current = false;
      if (isServiceId(next)) openService(next);
      else closeService();
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openService, closeService]);

  const open = useCallback(
    (id: ServiceId) => {
      window.history.pushState({ oryx: id }, "", `#${id}`);
      pushed.current = true;
      openService(id);
    },
    [openService],
  );

  const close = useCallback(() => {
    if (pushed.current) {
      // Lets the browser back action and this control share one path.
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", window.location.pathname);
    closeService();
  }, [closeService]);

  const service = activeService ? serviceById(activeService) : null;

  return (
    <>
      {/* Ambient dust in the live accent, behind everything. */}
      <Particles />
      <Opening />
      <SceneTracker />
      <Nav />
      <JourneyRail />

      {/* Five chapters. The order matches lib/chapters.ts and is read
          by the stage: Stage3D indexes its camera poses by chapter and
          Mark splits the object at index 1, so Services stays second. */}
      <main id="main">
        <Hero />
        <ServiceSelector onOpen={open} />
        <Standard />
        <Process />
        <Contact />
      </main>

      <AnimatePresence>
        {service ? (
          <ServiceWorld key={service.id} service={service} onClose={close} />
        ) : null}
      </AnimatePresence>

      <ContactGateway />

      <div className="grain" aria-hidden="true" />
    </>
  );
}
