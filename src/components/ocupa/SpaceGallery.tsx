import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type SpaceGalleryProps = {
  images: string[];
  name: string;
};

export function SpaceGallery({ images, name }: SpaceGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const gallery = images.length > 0 ? images : [];

  const showPrevious = () => {
    setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % gallery.length);
  };

  if (gallery.length === 0) return null;

  return (
    <>
      <section aria-label={`Fotos de ${name}`} className="relative">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto md:grid md:grid-cols-[1.25fr_.75fr] md:grid-rows-2 md:overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setActiveImage(0);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] min-w-full snap-center overflow-hidden rounded-md bg-muted md:row-span-2 md:aspect-auto md:min-w-0"
          >
            <img
              src={gallery[0]}
              alt={`${name}, vista principal`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            />
          </button>
          {gallery.slice(1, 3).map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => {
                setActiveImage(index + 1);
                setOpen(true);
              }}
              className="group relative aspect-[4/3] min-w-[88%] snap-center overflow-hidden rounded-md bg-muted md:aspect-auto md:min-w-0"
            >
              <img
                src={image}
                alt={`${name}, vista ${index + 2}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="inverse"
          size="sm"
          onClick={() => setOpen(true)}
          className="absolute bottom-4 right-4 border border-primary/15 shadow-sm"
        >
          <Images /> Ver todas as fotos
        </Button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl border-border bg-background p-4 sm:p-6">
          <DialogTitle className="pr-10 font-serif text-2xl text-primary">
            Fotos de {name}
          </DialogTitle>
          <DialogDescription className="sr-only">Galeria de imagens do espaço</DialogDescription>
          <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-md bg-muted">
            <img
              src={gallery[activeImage]}
              alt={`${name}, foto ${activeImage + 1}`}
              className="h-full w-full object-cover"
            />
            {gallery.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="inverse"
                  size="icon"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="inverse"
                  size="icon"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Próxima foto"
                >
                  <ChevronRight />
                </Button>
              </>
            ) : null}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {activeImage + 1} de {gallery.length}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
