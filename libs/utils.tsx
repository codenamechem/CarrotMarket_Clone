//함수를 활용한 ClassName 활용법
export function cls(...classnames: string[]) {
  // ...무한으로 인자를 받음
  return classnames.join(" "); //" "classname 뒤에 한칸 공백으로 넣어줌
}
