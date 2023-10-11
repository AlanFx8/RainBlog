export default class ScrollController {
    KEYS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
    WheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    _preventDefault = (e: Event) => {
        e.preventDefault();
    }

    _preventDefaultForScrollKeys = (e: any) => {
        if (this.KEYS.indexOf(e.key) > -1){
            e.preventDefault();
            return false;
        }
    }

    DisableScrolling = () => {
        document.addEventListener(this.WheelEvent, this._preventDefault, {passive: false}); //Firefox and Opera
        window.addEventListener('touchmove', this._preventDefault); //For mobile
        window.addEventListener('DOMMouseScroll', this._preventDefault, false); //For older FF
        window.addEventListener('keydown', this._preventDefaultForScrollKeys, false);
    }

    EnableScrolling = () => {
        document.removeEventListener(this.WheelEvent, this._preventDefault); //Firefox and Opera
        window.removeEventListener('touchmove', this._preventDefault); //For mobile
        window.removeEventListener('DOMMouseScroll', this._preventDefault, false); //For older FF
        window.removeEventListener('keydown', this._preventDefaultForScrollKeys, false);
    }
}