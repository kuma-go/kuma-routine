#!/bin/zsh
# KUMA routine — 깃허브에 올리기
# 파인더에서 이 파일을 더블클릭하면 됩니다.
cd "$(dirname "$0")" || exit 1
echo "폴더: $(pwd)"
echo "올릴 커밋:"
git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline -5
echo
git push origin main
code=$?
echo
if [ $code -eq 0 ]; then
  echo "✅ 올렸습니다. GitHub Actions 가 배포를 시작합니다."
  echo "   https://github.com/kuma-go/kuma-routine/actions"
else
  echo "❌ 실패했습니다 (코드 $code)"
  echo "   자격증명을 물으면 비밀번호 대신 Personal Access Token 을 넣으세요."
fi
echo
echo "창을 닫으려면 아무 키나 누르세요."
read -k1 -s
