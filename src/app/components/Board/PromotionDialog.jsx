import { PIECE_MAPPINGS } from "@/app/constants/pieces"

export const PromotionDialog = ({ color, onPromotionCompleted }) => {

    const promotionPieces = color === "white" ? ["N", "R", "B", "Q"] : ["n", "r", "b", "q"]
    return (
        <div className="bg-white p-10 h-1/3 border w-full flex justify-center absolute top-10 z-10 border-black rounded-md">
            Choose your piece
            {
                promotionPieces.map((item, index) => (
                    <img src={PIECE_MAPPINGS[item]} key={index} className="cursor-pointer" onClick={() => onPromotionCompleted(item)} />
                ))
            }
        </div>
    )
}