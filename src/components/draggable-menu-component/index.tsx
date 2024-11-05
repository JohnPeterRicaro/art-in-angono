import { Dispatch, PropsWithChildren, SetStateAction } from "react";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DraggableMenuComponent = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <section
      className={
        "z-50 absolute w-full bottom-0 h-auto flex justify-center items-center "
      }
    >
      <div
        className={
          "bg-white w-full pt-[9px] px-[27px] pb-[18px] text-center space-y-[14px] rounded-t-[24px]"
        }
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          type={"button"}
          className={
            "w-[64px] h-[5px] rounded-full bg-[#D9D9D9] hover:bg-gray-400 transition-all"
          }
        ></button>
        {children}
      </div>
    </section>
  );
};

export default DraggableMenuComponent;
