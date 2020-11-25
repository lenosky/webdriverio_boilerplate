import { Element, ElementArray } from 'webdriverio';

const lazyInterface = ['_$', '_$$', 'get', 'isExisting'];

interface IElement extends Element {
    _$(selector: string): IElement,

    isExisting(): Promise<boolean>,

    _$$(selector: string): IElementArray;
}

interface IElementArray extends ElementArray {
    get(index: number): IElement;
}

class LazyElements {
    private selector: string;
    private initParent: Function;
    private index: number;
    private parent: any;
    private currentElement: any;

    constructor(selector, initParent?, index = 0) {
        this.index = index;
        this.initParent = initParent;
        this.selector = selector;
    }

    get(index: number) {
        const getEl = function () {
            if (this.parent) {
                return this.parent
            } else if (this.initParent) {
                return this.initParent()
            }

            throw new Error('Parent element initialization failed')
        };

        return startChaining(this.selector, getEl.bind(this), index);
    }

    async isExisting(): Promise<boolean> {
        try {
            return !!(await this._getCurrentElement());
        } catch (e) {
            return false;
        }
    }

    async _getCurrentElement() {
        if (this.currentElement) {
            return this.currentElement;
        }

        if (this.initParent) {
            this.parent = this.initParent();
            const collection = await this.parent.$$(this.selector);
            this.currentElement = collection[this.index];
        } else {
            const collection = await $$(this.selector);
            this.currentElement = collection[this.index];
        }

        if (!this.currentElement) {
            let errorMessage = `${this.selector} with index ${this.index} was not found`;
            if (this.parent) {
                errorMessage = `${this.parent.selector} does not have child ${this.selector} with index ${this.index}`;
            }

            throw new Error(errorMessage)
        }

        return this.currentElement;
    };
}

function startChaining(selector, initParent = null, index = 0): IElement {
    const lazyElements = new LazyElements(selector, initParent, index);

    return new Proxy(lazyElements, {
        get(target, propName) {
            if (lazyInterface.includes(propName as string)) {
                return (...args) => target[propName](...args);
            } else {
                return (...args) => target._getCurrentElement().then(el => {
                    return el[propName].call(el, ...args);
                });
            }
        }
    }) as any;
}

const _$ = (selector): IElement => startChaining(selector);
const _$$ = (selector): IElementArray => startChaining(selector) as any;

export {
    _$,
    _$$
}