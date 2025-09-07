let canvasWidth;
let canvasHeight;

canvasWidth = window.innerWidth - 10;
canvasHeight = window.innerHeight / 2;

let elementCount = 200;
const unsortedArray = []

let animationSpeed = 80;

for(let i = 0; i < elementCount; i ++){
    unsortedArray.push(Math.floor(Math.random() * canvasHeight));
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)});
}

class AUDIOPENE{
    constructor(duration){
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.du = 50
    }
    // map value to frequency
    valueToFreq(value) {
        return 200 + (40* (value+1) / (elementCount)); // 200–1000 Hz
    }
    actuallyPlay(value){
        this.playTone(this.valueToFreq(value),animationSpeed);
    }
    // play a short tone
    playTone(freq, duration = 100) {
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.value = (freq+1);
        gainNode.gain.value = 0.00;

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + this.du / 1000);
    }
}


const audio = new AUDIOPENE(elementCount,animationSpeed)

class Canvas{
    constructor(width, height){
        this.canvas = document.getElementById("sort_visualization");
        this.canvas_ctx = this.canvas.getContext("2d");

        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height; 
    
        this.initializeCanvas();
    }

    initializeCanvas(){
        this.canvas_ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.canvas_ctx.rotate(Math.PI);
        this.canvas_ctx.scale(-1, 1);
        this.canvas_ctx.translate(- this.canvas.width / 2, - this.canvas.height / 2);8
    }

    clearCanvas(){
        this.canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearElement(offsetX, height){
        let width = Math.ceil(this.width/elementCount);
        this.canvas_ctx.clearRect(offsetX * width, 0, width, height);
    }

    drawArrayElement(element, color, offsetX){
        //audio.actuallyPlay(element/2)
        let width = Math.ceil(this.width/elementCount)
        this.canvas_ctx.fillStyle = color;
        
        this.canvas_ctx.fillRect(offsetX * width, 0, width, element);
        //this.canvas_ctx.clearRect(offsetX, 0, 20, 50);
        
    }

    drawArray(array){
        let offsetX = 0;
        let rectangleWidth = Math.ceil(this.canvas.width/elementCount);
        this.canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        array.forEach(element => {
                this.canvas_ctx.fillStyle = "black";
                this.canvas_ctx.fillRect(offsetX * rectangleWidth, 0, rectangleWidth, element);
                offsetX ++;
        });
    }
}
//BUBBLE SORT 
class BubbleSort{
    constructor(){
        let aborted = false;
    }
    abort(){
        this.aborted = true;
    }
    sort(array){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let sorted = false;
        let j = array.length;
        let sortedArray = [...array]; 
        do{
            sorted = true;
            for(let i = 0; i < j; i++){
                if(sortedArray[i] > sortedArray[i+1]){
                    let swap = sortedArray[i];
                    sortedArray[i] = sortedArray[i+1];
                    sortedArray[i+1] = swap;
                    sorted = false;
                }
            }
            j--;
        }while(!sorted && j > 1);
        return sortedArray; 
    }
    
    async animateSort(array, canvas){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let i = 0;
        let j = array.length;
        let sorted;
        let sortedArray = [...array]

        canvas.clearCanvas();
        canvas.drawArray(sortedArray);

        while(!sorted){
			if(this.aborted){
            	throw new Error("Aborted");
        	}
            sorted = true;
            for(i = 0; i < j; i++){
				if(this.aborted){
            		throw new Error("Aborted");
        		}
                canvas.drawArrayElement(sortedArray[i], "red", i);
                canvas.drawArrayElement(sortedArray[i+1], "red", i+1);
                await sleep(animationSpeed)
                canvas.clearElement(i, sortedArray[i])
                canvas.clearElement(i+1, sortedArray[i+1])

                if(sortedArray[i] > sortedArray[i+1]){
                    [sortedArray[i], sortedArray[i+1]] = [sortedArray[i+1], sortedArray[i]];
                    sorted = false;
                }
                canvas.drawArrayElement(sortedArray[i], "black", i);
                canvas.drawArrayElement(sortedArray[i+1], "black", i+1);
                //}, 20);
                //await sleep(100)        
            }
            j--;
        }
        
    }
}

class SelectionSort{
    constructor(){
        let aborted = false;
    }
    abort(){
        this.aborted = true;
    }
    sort(array){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let sortedArray = [...array];
        //let min = canvasHeight;
        for(let j = 0; j < sortedArray.length/2; j++){
			if(this.aborted){
            	throw new Error("Aborted");
        	}
            let maxIndex = j;
            let minIndex = j;
            
            for(let i = j; i < sortedArray.length - j; i++){
				if(this.aborted){
            		throw new Error("Aborted");
        		}
                if(sortedArray[i] < sortedArray[minIndex]){
                    minIndex = i
                } 
                if(sortedArray[i] > sortedArray[maxIndex]){
                    maxIndex = i
                }                
            }
            
            let swap = sortedArray[j];
            sortedArray[j] = sortedArray[minIndex];
            sortedArray[minIndex] = swap;
            if(j === maxIndex){
                maxIndex = minIndex
            }
            swap = sortedArray[array.length-j-1];
            sortedArray[array.length-j-1] = sortedArray[maxIndex];
            sortedArray[maxIndex] = swap;
        }
        return sortedArray;
    }
    
    async animateSort(array, canvas){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let sortedArray = [...array];
        canvas.clearCanvas();
        canvas.drawArray(sortedArray);
        for(let j = 0; j < sortedArray.length/2; j++){
			if(this.aborted){
            	throw new Error("Aborted");
        	}
            let maxIndex = j;
            let minIndex = j;
            
            for(let i = j; i < sortedArray.length - j; i++){
				if(this.aborted){
            		throw new Error("Aborted");
        		}
                canvas.drawArrayElement(sortedArray[i], "red", i);
                canvas.drawArrayElement(sortedArray[minIndex], "green", minIndex);
                canvas.drawArrayElement(sortedArray[maxIndex], "green", maxIndex);
                await sleep(animationSpeed)
                canvas.clearElement(i, sortedArray[i])
                canvas.clearElement(minIndex, sortedArray[minIndex])
                canvas.clearElement(maxIndex, sortedArray[maxIndex])
                canvas.drawArrayElement(sortedArray[i], "black", i);
                canvas.drawArrayElement(sortedArray[minIndex], "black", minIndex);
                canvas.drawArrayElement(sortedArray[maxIndex], "black", maxIndex);
                if(sortedArray[i] < sortedArray[minIndex]){
                    minIndex = i
                } 
                if(sortedArray[i] > sortedArray[maxIndex]){
                    maxIndex = i
                }               
            }
            canvas.clearElement(j, sortedArray[j]);
            canvas.clearElement(minIndex, sortedArray[minIndex]);
            canvas.clearElement(array.length-j-1, sortedArray[array.length-j-1]);
            canvas.clearElement(maxIndex, sortedArray[maxIndex]);
            
            let swap = sortedArray[j]; 
            sortedArray[j] = sortedArray[minIndex]; 
            sortedArray[minIndex] = swap;

            if(j === maxIndex){
                maxIndex = minIndex
            }
            if(sortedArray[maxIndex] > sortedArray[array.length-j-1]){
                swap = sortedArray[array.length-j-1]; // 411
                
                sortedArray[array.length-j-1] = sortedArray[maxIndex]; // 
                sortedArray[maxIndex] = swap;
            }

            canvas.drawArrayElement(sortedArray[j], "black", j);
            canvas.drawArrayElement(sortedArray[minIndex], "black", minIndex);
            canvas.drawArrayElement(sortedArray[array.length-j-1], "black", array.length-j-1);
            canvas.drawArrayElement(sortedArray[maxIndex], "black", maxIndex);
        }
        return sortedArray;
    }
}

class MergeSort{
    constructor(){
        let aborted = false;
    }
    abort(){
        this.aborted = true;
    }


    merge(arr,mid, begin, end){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let arr2 = [...arr]
        let j = begin;
        let k = mid+1;

        for(let i = begin; i <= end; i++){
			if(this.aborted){
            	throw new Error("Aborted");
       	 	}
            if(j === mid+1){
                arr[i] = arr2[k];
                k++;
                continue;
            }
            if(k === end+1){
                arr[i] = arr2[j];
                j++;
                continue;
            }
            if(arr2[j] < arr2[k]){
                arr[i] = arr2[j];
                j++;
            }else{
                arr[i] = arr2[k];
                k++;
            }
        }
    }

    sort(arr, begin, end){
        if(this.aborted){
            throw new Error("Aborted");
        }
        if(begin >= end){
            return;
        }
        
        const mid = Math.floor(begin + (end - begin)/2)
        this.sort(arr, begin, mid);
        this.sort(arr, mid+1, end);
        this.merge(arr,mid, begin, end);
    }

    async animateMerge(arr, mid, begin, end, canvas){
        if(this.aborted){
            throw new Error("Aborted");
        }
        let arr2 = [...arr]
        let j = begin;
        let k = mid+1;

        for(let i = begin; i <= end; i++){
			if(this.aborted){
            	throw new Error("Aborted");
        	}
            if(j === mid+1){
                canvas.drawArrayElement(arr[k], "green", k);
                await sleep(animationSpeed);
                canvas.drawArrayElement(arr[k], "black", k);
                canvas.clearElement(i, canvas.height);
                arr[i] = arr2[k];
                k++;
                
                canvas.drawArrayElement(arr[i],"black",i)
                continue;
            }
            if(k === end+1){
                canvas.drawArrayElement(arr[j], "green", j);
                await sleep(animationSpeed);
                canvas.drawArrayElement(arr[j], "black", j);
                canvas.clearElement(i, canvas.height);     
                arr[i] = arr2[j];
                j++;
                canvas.drawArrayElement(arr[i],"black",i)
                continue;
            }

            canvas.drawArrayElement(arr[j], "green", j);
            canvas.drawArrayElement(arr[k], "green", k);
         
            await sleep(animationSpeed);

            canvas.drawArrayElement(arr[j], "black", j);
            canvas.drawArrayElement(arr[k], "black", k);

            canvas.clearElement(i, canvas.height);

            if(arr2[j] < arr2[k]){
                arr[i] = arr2[j];
                j++;
            }else{
                arr[i] = arr2[k];
                k++;
            }
            //canvas.drawArrayElement(arr[j], "black", j);
            //canvas.drawArrayElement(arr[k], "black", k);
            canvas.drawArrayElement(arr[i],"black",i)
        }
    }

    async animationSort(arr, begin, end, canvas){
        if(this.aborted){
            throw new Error("Aborted");
        }
        if(begin >= end){
            return;
        }
        
        const mid = Math.floor(begin + (end - begin)/2)
        await Promise.all([this.animationSort(arr, begin, mid, canvas),this.animationSort(arr, mid+1, end, canvas)]);
	await this.animateMerge(arr, mid, begin, end, canvas);
    }

    async initAnimateSort(unsortedArray, canvas){
        if(this.aborted){
            throw new Error("Aborted");
        }
        const arr = [...unsortedArray];
        canvas.drawArray(arr);
        await this.animationSort(arr, 0, arr.length-1, canvas);
    }
}



let userSelection = document.getElementById("algortithm_selection");
let currentAlgorithm = userSelection.value;
const canvas1 = new Canvas(canvasWidth, canvasHeight);
let canAnimationStart = true;




userSelection.onchange = () => {
    currentAlgorithm = userSelection.value;
    canAnimationStart = true;
}
let currentPlaying = null;
const startAnimation = async () => {
    if(currentPlaying){
        currentPlaying.abort();
		await currentPlaying;
		await sleep(3);
		canvas1.clearCanvas();
    }
    canAnimationStart = false;
    canvas1.clearCanvas()
    switch (currentAlgorithm){
        case "Bubble Sort":
            const bubble = new BubbleSort();
            bubble.animateSort(unsortedArray, canvas1);
            currentPlaying = bubble;
            break;
        case "Selection Sort": 
            const selection = new SelectionSort();
            selection.animateSort(unsortedArray, canvas1);
            currentPlaying = selection;
            break
        case "Merge Sort": 
            const merge = new MergeSort();
            merge.initAnimateSort(unsortedArray, canvas1);
            currentPlaying = merge;
            break
    }
}

const abortButton = async () => {
	currentPlaying.abort();
	await currentPlaying;
	await startAnimation;
	await sleep(3);
	canvas1.clearCanvas();
}
const changeAnimationSpeed = (html_element) => {
    animationSpeed = 150 - (150 * html_element.value) / 100 + 1;
    console.log(animationSpeed);
}

const changeElementCount = (html_element) => {
    elementCount = html_element.value;
}
