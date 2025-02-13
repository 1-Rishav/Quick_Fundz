import React from 'react'
import {motion} from 'motion/react'
const CustomButton = ({button , textColor , bottomColor,rgbColor,props,disabled}) => {
  return (
   <div className='[perspective::1000px] [transform-style:preserve-3d] h-full w-full  flex items-center justify-center' style={{
    backgroundImage:`radial-gradient(circle at 1px 1px, rgba(6,182,212 ,0.2) 0.5px, transparent 0)`,
    bakcgroundSize:'8px 8px',
    backgroundRepeat:'repeat',
   }}>
    <motion.button
    // initial={{
    //     rotate:0,
    // }}
    // animate={{
    //     rotate:[0,5,0],
    // }}
     transition={{
        duration:0.4,
        ease:'easeInOut'
     }}
    whileHover={{
        rotateX:10,
        rotateY:10,
        //rgba(8,112,184,0.7)
        boxShadow:`0px 5px 20px ${rgbColor}`,
        y: -6,
    }}
    whileTap={{
        y:0
    }}
    style={{
        translateZ:100,
    }}
    className='group relative text-neutral-100 px-10 py-3 tracking-wide  rounded-lg bg-black shadow-[0px_1px_2px_0px_rgba(255,255,255,0.1)_inset , 0px_-1px_2px_0px_rgba(255 , 255, 255, 0.1)_inset]' {...props}
    disabled={disabled}
    ><span className={`group-hover:${textColor}  transition-colors duration-300`}>{button}</span>
        <span className={`absolute inset-x-0 bottom-px bg-gradient-to-r from-transparent ${bottomColor} to-transparent h-px w-3/4 mx-auto`}></span>
        <span className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-x-0 bottom-0 bg-gradient-to-r from-transparent ${bottomColor} to-transparent h-[4px] w-3/4 mx-auto blur-sm`}></span>
    </motion.button>
   </div>
  )
}

export default CustomButton