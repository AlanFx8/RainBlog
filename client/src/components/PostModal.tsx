import React, { useEffect, useState } from 'react';
import { ImageSection, ModalImageRect } from '../tsobjects/post-objects';
import ImageIndexSet from '../classes/ImageIndexSet';
import '../styles/image-modal.scss';

//#region  INTERFACES
interface IPostModal {
    onClick: () => void,
    onCenterIndexChanged: (index: number) => void,
    imageSet: ImageSection[]
    centerIndex: number,
}

interface IPostModalImage {
    modalImageRect: ModalImageRect[],
    imageIndexes: number[],
    imageSet: ImageSection[],
    nextSlide: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
    prevSlide: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}
//#endregion

//#region THE POST MODEL COMPONENT
const _ImageIndxes = new ImageIndexSet;

const PostModal: React.FC<IPostModal> = ({ onClick, onCenterIndexChanged, imageSet, centerIndex }) => {
    //=== FIELDS ===///
    const IMAGE_COUNT = 5;
    const LAST_IMAGE = imageSet.length - 1;

    //IsAnimating is for setState, _AnimatingSlide is for window events
    const [IsAnimating, SetIsAnimating] = useState<boolean>(false);
    let _AnimatingSlide = false;
    const [ModalImageRects, SetModalImageRects] = useState<ModalImageRect[]>([]);
    let InSecondLayout = false;

    //=== START ===//
    useEffect(() => {
        //Set up center image - it must be decreased by 2
        let centerImage = centerIndex;
        for (let x = 0; x < 2; x++){
            centerImage = _DecreaseImageIndex(centerImage, LAST_IMAGE);
        }

        //Initialize states
        _SetInitialImageIndexes(centerImage);
        _InitializeImageModalData();

        //Set events
        window.addEventListener('keydown', OnKeyInput);
        window.addEventListener("resize", _InitializeImageModalData);

        //Remove events
        return () => {
            window.removeEventListener('keydown', OnKeyInput);
            window.removeEventListener("resize", _InitializeImageModalData);
        }
    }, []);

    //=== START METHODS ===//
    const _SetInitialImageIndexes = (centerImage: number): void => {
        const indexes = [IMAGE_COUNT] as number[];
        for (let x = 0; x < IMAGE_COUNT; x++){
            indexes[x] = centerImage;
            centerImage = _IncreaseImageIndex(centerImage, LAST_IMAGE);
        }
        _ImageIndxes.SetIndexs(indexes);
    }

    const _InitializeImageModalData = () => {
        _GetLayoutType();
        const imageSections: ModalImageRect[] = [];
        const screenWidth = (InSecondLayout) ? window.innerWidth * .5 : window.innerWidth;
        const modalWidth = (InSecondLayout) ? window.innerWidth * .4 : window.innerWidth * .6;
        const startLeftPosition = (0 - (modalWidth * .5)) - (InSecondLayout ? screenWidth : screenWidth * 1.5);
        const modalHeight = (InSecondLayout) ? window.innerHeight * .6 : window.innerHeight * .8;
        const top = window.innerHeight * .5 - (modalHeight * .5);
        for (let x = 0; x < IMAGE_COUNT; x++){
            const left = startLeftPosition + screenWidth * x;
            imageSections.push({
                left: left,
                top: top,
                width: modalWidth,
                height: modalHeight
            });
        }
        SetModalImageRects(imageSections);
    }

    const _GetLayoutType = () => {
        let secondLayoutQuery = window.matchMedia("(min-width: 40em)");
        InSecondLayout = secondLayoutQuery.matches;
    }

    //=== EVENTS ===//
    const OnKeyInput = (e: KeyboardEvent): void => {
        if (e.key === "ArrowRight"){
            _AnimateSlide(true);
        }
        if (e.key === "ArrowLeft"){
            _AnimateSlide(false);
        }
        if (e.key === "Escape"){
            onClick();
        }
    }

    //=== PUBLIC METHODS ===//
    const AnimateNextSlide = (e: React.MouseEvent<HTMLImageElement, MouseEvent>): void => {
        e.preventDefault();
        _AnimateSlide(true);
    }

    const AnimatePrevSlide = (e: React.MouseEvent<HTMLImageElement, MouseEvent>): void => {
        e.preventDefault();
        _AnimateSlide(false);
    }

    //=== PRIVATE METHODS ==//
    const _AnimateSlide = (nextSlide: boolean): void => {
        if (IsAnimating || _AnimatingSlide) return;
        if (imageSet.length === 1) return;
        SetIsAnimating(true);
        _AnimatingSlide = true;
        _GetLayoutType();

        const innerModal = document.getElementById("image-model-inner");
        if (!innerModal) return;

        //Now animate
        const animateTime = 500;
        const screenWidth = (InSecondLayout) ? window.innerWidth * .5 : window.innerWidth;
        const pos = nextSlide ? `translateX(-${screenWidth}px)` : `translateX(${screenWidth}px)`;
        innerModal.animate([
            { transform: pos }],
            { duration: animateTime, fill: 'forwards'}
        );

        setTimeout(() => {
            if (nextSlide){
                _IncreaseTargetSlide();
            }
            else {
                _DecreaseTargetSlide();
            }

            innerModal.animate([
                { transform: "translateX(0)" }],
                { duration: 0, fill: 'forwards'}
            );
            SetIsAnimating(false);
            _AnimatingSlide = false;
        }, animateTime);
    }

    const _IncreaseTargetSlide = (): void => {
        const newImageIndexes = _ImageIndxes.GetIndexs();
        for (let x = 0; x < newImageIndexes.length; x++){
            newImageIndexes[x] = _IncreaseImageIndex(newImageIndexes[x], LAST_IMAGE);
        }
        _ImageIndxes.SetIndexs(newImageIndexes);
        onCenterIndexChanged(_ImageIndxes.GetIndexs()[2]);
    }

    const _DecreaseTargetSlide = (): void => {
        const newImageIndexes = _ImageIndxes.GetIndexs();
        for (let x = 0; x < newImageIndexes.length; x++){
            newImageIndexes[x] = _DecreaseImageIndex(newImageIndexes[x], LAST_IMAGE);
        }
        _ImageIndxes.SetIndexs(newImageIndexes);
        onCenterIndexChanged(_ImageIndxes.GetIndexs()[2]);
    }

    const _DecreaseImageIndex = (index: number, lastImage: number): number => {
        return (index === 0) ? lastImage : index - 1;
    }

    const _IncreaseImageIndex = (index: number, lastImage: number): number => {
        return (index === lastImage) ? 0 : index + 1;
    }

    const _OnModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        if (IsAnimating || _AnimatingSlide) return;
        const target = e.target as HTMLDivElement;
        if (target.id.startsWith("image")){
            onClick();
        }
    }

    //=== RENDER ===//
    return (<div id="image-modal" onClick={ _OnModalClick }>
        <div id="image-model-inner" >
            <PostModalImage
                modalImageRect={ ModalImageRects }
                imageIndexes={ _ImageIndxes.GetIndexs() }
                imageSet={ imageSet }
                nextSlide={ AnimateNextSlide }
                prevSlide={ AnimatePrevSlide }                
            />
        </div>
    </div>);
}
//#endregion

//#region THE POST MODAL IMAGE COMPONENT
const PostModalImage: React.FC<IPostModalImage> = ({
    modalImageRect, imageIndexes, imageSet,
    nextSlide, prevSlide }) => {
    const _modalImages = modalImageRect.map((item, index) => {
        if (imageSet.length === 1 && index !== 2){
            return null;
        }

        const _style = {
            left: item.left+"px",
            top: item.top+"px",
            width: item.width+"px",
            height: item.height+"px"
        }

        const targetImage = imageSet[imageIndexes[index]];
        return <img
            alt= { targetImage.imgName }
            title= { targetImage.imgName }
            src= { targetImage.imgData }
            className='image-modal-object'
            style= { _style }
            key={ index }
            onClick={ (index === 1 ? prevSlide : nextSlide) }
        />
    });

    //RENDER
    return <>{ _modalImages }</>
}
//#endregion

//=== EXPORT ===//
export default PostModal;