import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const  HeaderDisplay = () => {
  const imagesData = [
    "https://images.unsplash.com/photo-1705475025559-ad8efdedc74f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8M2QlMjBwcmludGVyfGVufDB8fDB8fHww",
    "https://images.pexels.com/photos/20341728/pexels-photo-20341728.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-20341728.jpg&fm=jpg",
    "https://d11n7da8rpqbjy.cloudfront.net/io3dp/770061882839Printers___Skulls__2___1_.jpg",
    "https://images.pexels.com/photos/30554826/pexels-photo-30554826/free-photo-of-close-up-of-a-futuristic-3d-printer-in-action.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ];

  return (
    <Carousel className="my-10 mx-auto w-[93vw] overflow-x-clip sm:overflow-visible">
      <CarouselContent>
        {imagesData.map((image) => (
          <CarouselItem key={image}>
            <img
              src={image}
              loading="lazy"
              className="object-cover w-full h-[60vh] rounded-3xl"
              alt="3D Print Display"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HeaderDisplay;
