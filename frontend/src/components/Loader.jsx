export default function FoodLoader({
  text = "Logging you in...",
  subText = "Preparing your delicious experience!",
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-md">

      {/* Center Loader Card */}
      <div className="w-[320px] max-w-[90%] rounded-3xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* Pizza Animation */}
        <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-50" />

          <span className="relative text-7xl animate-bounce">
            🍕
          </span>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-800">
          {text}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {subText}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-2/5 animate-food-progress rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
        </div>

        <p className="mt-3 text-xs font-semibold tracking-widest text-orange-600">
          PLEASE WAIT...
        </p>
      </div>
    </div>
  );
}