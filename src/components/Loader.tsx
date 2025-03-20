
const Loader = () => {
  return (
    <div className="flex items-center justify-center p-12 w-full">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin [animation-delay:0.2s]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
