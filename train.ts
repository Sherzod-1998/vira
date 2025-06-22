//MIT TASK ZU
/** Shunday function yozing, u parametridagi array ichida takrorlanmagan raqamlar yig'indisini qaytarsin.
MASALAN: sumOfUnique([1,2,3,2]) return 4
 */
function sumOfUnique(nums: number[]): number {
	// Elementlarni sanash uchun obyekt
	const count: { [key: number]: number } = {};

	// Elementlarni sanaymiz
	for (const num of nums) {
		if (count[num]) {
			count[num]++;
		} else {
			count[num] = 1;
		}
	}

	// Takrorlanmagan elementlar yig'indisini hisoblaymiz
	let uniqueSum = 0;
	for (const key in count) {
		if (count[key] === 1) {
			uniqueSum += Number(key);
		}
	}

	return uniqueSum;
}

// Misol uchun
console.log(sumOfUnique([1, 2, 3, 2])); // 4 qaytishi kerak

// // MIT TASK ZT
// /** Shunday function yozing, u parametridagi string ichida 1 martadan ortiq 
//  * qaytarilmagan birinchi harf indeksini qaytarsin.
// MASALAN: firstUniqueCharIndex(“stamp”) return 0
//  */
// function firstUniqueCharIndex(s) {
// 	// Harflarning chastotasi uchun obyekt
// 	const charCount = {};

// 	// Harflar chastotasini hisoblash
// 	for (const char of s) {
// 		if (charCount[char]) {
// 			charCount[char]++;
// 		} else {
// 			charCount[char] = 1;
// 		}
// 	}
// 	for (let i = 0; i < s.length; i++) {
// 		if (charCount[s[i]] === 1) {
// 			return i;
// 		}
// 	}
// 	return -1;
// }

// console.log(firstUniqueCharIndex('stamp')); // 0

// // MIT TASK ZS
// function singleNumber(nums: number[]): number {
// 	const countMap: { [key: number]: number } = {};
// 	for (const num of nums) {
// 		if (countMap[num] === undefined) {
// 			countMap[num] = 1;
// 		} else {
// 			countMap[num]++;
// 		}
// 	}
// 	for (const num in countMap) {
// 		if (countMap[num] === 1) {
// 			return parseInt(num);
// 		}
// 	}

// 	throw new Error("Arrayda faqat bir marta kelgan element yo'q");
// }

// console.log(singleNumber([4, 2, 1, 2, 1]));

// MIT TASK ZR
/**Shunday function yozing, u parametridagi string ichidagi raqam va sonlarni 
 * sonini sanasin.
MASALAN: countNumberAndLetters(“string152%\¥”) return {number:3, letter:6}
 */

// function countNumberAndLetters(str) {
// 	const count = { number: 0, letter: 0 };

// 	for (let i = 0; i < str.length; i++) {
// 		const char = str[i];
// 		if (/[0-9]/.test(char)) {
// 			count.number++;
// 		} else if (/[a-zA-Z]/.test(char)) {
// 			count.letter++;
// 		}
// 	}

// 	return count;
// }

// countNumberAndLetters('string152%¥');

// MIT TASK ZQ
/** Shunday function yozing, u parametridagi array ichida 2 marta 
 * qaytarilgan sonlarni alohida araryda qaytarsin.
MASALAN: findDuplicates([1,2,3,4,5,4,3,4]) return [3, 4]
 */
// function findDuplicates(arr) {
// 	const counts = {};
// 	const duplicates = [];

// 	// Elementlarni sanash
// 	for (let i = 0; i < arr.length; i++) {
// 		if (counts[arr[i]]) {
// 			counts[arr[i]] += 1;
// 		} else {
// 			counts[arr[i]] = 1;
// 		}
// 	}

// 	// 2 marta uchragan elementlarni topish
// 	for (const key in counts) {
// 		if (counts[key] === 2) {
// 			duplicates.push(parseInt(key));
// 		}
// 	}

// 	return duplicates;
// }

// // Misol
// console.log(findDuplicates([1, 2, 3, 4, 5, 3, 4])); // [3, 4]

// // MIT TASK ZP

// // Shunday function yozing, u 2 ta array parametr qabul qilsin.
// // Siz bu ikki arrayning qiymatlari o'xshash bo'lishini
// // (ya'ni, ularning barcha elementlari bir xil bo'lishini) tekshirishingiz kerak.

// MASALAN: areArraysEqual([1, 2, 3], [3, 1, 2]); // true
// areArraysEqual([1, 2, 3], [3, 1, 2, 1]); // true
// areArraysEqual([1, 2, 3], [4, 1, 2]); // false

// function areArraysEqual(arr1: number[], arr2: number[]): boolean {
// 	const countElements = (arr: number[]): Record<number, number> => {
// 		return arr.reduce(
// 			(acc, num) => {
// 				acc[num] = (acc[num] || 0) + 1;
// 				return acc;
// 			},
// 			{} as Record<number, number>,
// 		);
// 	};

// 	const count1 = countElements(arr1);
// 	const count2 = countElements(arr2);

// 	return (
// 		Object.keys(count1).length === Object.keys(count2).length &&
// 		Object.keys(count1).every((key) => count1[+key] === count2[+key])
// 	);
// }

// // Testlar
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2])); // true
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1])); // true
// console.log(areArraysEqual([1, 2, 3], [4, 1, 2])); // false

// MIT TASK ZO
/**Shunday function yozing, u parametrdagi string ichidagi qavslar miqdori balansda ekanligini aniqlasin. 
 * Ya'ni ochish("(") va yopish(")") qavslar soni bir xil bolishi kerak.
MASALAN: areParenthesesBalanced("string()ichida(qavslar)soni()balansda") return true
 */

// function areParenthesesBalanced(input: string): boolean {
// 	let balance = 0;

// 	for (const char of input) {
// 		if (char === '(') {
// 			balance++;
// 		} else if (char === ')') {
// 			balance--;
// 		}

// 		if (balance < 0) {
// 			return false;
// 		}
// 	}

// 	return balance === 0;
// }

// console.log(areParenthesesBalanced('string()ichida(qavslar)soni()balansda'));

//MIT TASK ZN
/** type scriptda Shunday function yozing, uni array va number parametri 
 * bolsin. Ikkinchi parametrda berilgan raqamli indexgacha arrayni orqasiga ogirib qaytarsin.
MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3) return [5, 6, 1, 2, 3, 4] */
// function rotateArray(arr: any[], index: number): any[] {
// 	const length = arr.length;
// 	const normalizedIndex = index % length;
// 	const firstPart = arr.slice(length - normalizedIndex);
// 	const secondPart = arr.slice(0, length - normalizedIndex);
// 	return firstPart.concat(secondPart);
// }

// // Funksiyani chaqirish misoli:
// const result = rotateArray([1, 2, 3, 4, 5, 6], 2);
// console.log(result); // [5, 6, 1, 2, 3, 4]

// MIT TASK ZM
/** type scriptda Shunday function yozing, u function parametrga berilgan 
 * raqamlarni orqasiga ogirib qaytarsin.
MASALAN: reverseInteger(123456789) return 987654321 */
// function reverseInteger(num: number): number {
// 	const reversedNum = parseInt(num.toString().split('').reverse().join(''));
// 	return reversedNum;
// }

// console.log(reverseInteger(123456789));

//TASK ZL

// function stringToKebab(str: string): string {
// 	return str
// 		.toLowerCase()
// 		.replace(/\s+/g, '-')
// 		.replace(/[^a-z0-9-]/g, '');
// }

// // Test
// console.log(stringToKebab('I love Kebab'));

//TASK ZK

// function printNumbers() {
// 	let count = 1;

// 	const intervalId = setInterval(() => {
// 		console.log(count);
// 		count++;

// 		if (count > 5) {
// 			clearInterval(intervalId);
// 		}
// 	}, 1000);
// }

// printNumbers();

//TASK ZJ

// function reduceNestedArray(arr: any[]): number {
// 	return arr.reduce((sum, item) => {
// 		if (Array.isArray(item)) {
// 			return sum + reduceNestedArray(item);
// 		}
// 		if (typeof item === 'number') {
// 			return sum + item;
// 		}
// 		return sum;
// 	}, 0);
// }

// console.log(reduceNestedArray([1, [1, 2, [4]]]));
