// ==UserScript==
// @name         YouTube Link Preview & Comments — Inline Player for Any Site
// @name:zh-TW   YouTube 連結預覽 & 留言瀏覽 — 任意網站內嵌播放器
// @name:zh-CN   YouTube 链接预览 & 评论浏览 — 任意网站内嵌播放器
// @name:ja      YouTube リンクプレビュー & コメント — 任意サイト内インラインプレイヤー
// @name:ko      YouTube 링크 미리보기 & 댓글 보기 — 모든 사이트 인라인 플레이어
// @name:es      YouTube Vista Previa de Enlace & Comentarios — Reproductor en línea para cualquier sitio
// @name:pt-BR   YouTube Pré-visualização de Link & Comentários — Reprodutor embutido para qualquer site
// @name:fr      YouTube Aperçu de Lien & Commentaires — Lecteur intégré pour tout site
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07?locale_override=1
// @namespace    https://github.com/Startanuki07
// @version      1.4.5
// @license      MIT
// @author       Star_tanuki07
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @match        *://*/*
// @exclude      https://www.youtube.com/*
// @exclude      https://www.youtube-nocookie.com/*
// @exclude      https://m.youtube.com/*
// @exclude      https://music.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.googleapis.com
// @connect      translate.googleapis.com
// @connect      youtube.com
// @connect      youtube-nocookie.com
// @description      Adds ▶️ and 💬 buttons next to YouTube links on any site. Opens an inline player or comment panel with search and translation. Requires a YouTube API key for comments.
// @description:zh-TW 在任意網站的 YouTube 連結旁新增 ▶️ 預覽與 💬 留言按鈕，支援內嵌播放器及留言搜尋翻譯。留言功能需 YouTube API 金鑰。
// @description:zh-CN 在任意网站的 YouTube 链接旁添加 ▶️ 预览和 💬 评论按钮，支持内嵌播放器及评论搜索翻译。评论功能需 YouTube API 密钥。
// @description:ja    任意サイトのYouTubeリンク横に ▶️ と 💬 ボタンを追加。インラインプレイヤーまたは検索・翻訳対応のコメントパネルを表示。コメント機能にはAPIキーが必要。
// @description:ko    모든 사이트의 YouTube 링크 옆에 ▶️ 미리보기와 💬 댓글 버튼을 추가합니다. 인라인 플레이어 및 검색·번역 지원 댓글 패널 제공. 댓글 기능은 API 키 필요.
// @description:es    Agrega botones ▶️ y 💬 junto a los enlaces de YouTube en cualquier sitio. Abre un reproductor en línea o panel de comentarios con búsqueda y traducción. Requiere una clave API de YouTube para los comentarios.
// @description:pt-BR Adiciona botões ▶️ e 💬 ao lado dos links do YouTube em qualquer site. Abre um reprodutor embutido ou painel de comentários com pesquisa e tradução. Requer uma chave API do YouTube para os comentários.
// @description:fr    Ajoute des boutons ▶️ et 💬 à côté des liens YouTube sur n'importe quel site. Ouvre un lecteur intégré ou un panneau de commentaires avec recherche et traduction. Nécessite une clé API YouTube pour les commentaires.
// ==/UserScript==

(function () {
  "use strict";

      if (window.location.hostname.includes("youtube.com") || window.location.hostname.includes("youtube-nocookie.com")) {
      return;
  }

  const LANG_DICT = {
    menu_refresh: {
      en: "Manual Refresh (Rescan Links)",
      "zh-TW": "手動刷新一次（重新掃描連結）",
      "zh-CN": "手动刷新一次（重新扫描链接）",
      ja: "手動更新（リンクを再スキャン）",
      ko: "수동 새로고침 (링크 재검색)",
      es: "Actualizar manualmente (Reescanear enlaces)",
      "pt-BR": "Atualização manual (Reescanear links)",
      fr: "Actualisation manuelle (Rescanner les liens)",
    },
    menu_add_api: {
      en: "Add/Edit API Key",
      "zh-TW": "新增/編輯 API Key",
      "zh-CN": "添加/编辑 API Key",
      ja: "APIキーを追加/編集",
      ko: "API 키 추가/편집",
      es: "Agregar/Editar clave API",
      "pt-BR": "Adicionar/Editar chave API",
      fr: "Ajouter/Modifier la clé API",
    },
    menu_del_api: {
      en: "Delete API Key",
      "zh-TW": "刪除 API Key",
      "zh-CN": "删除 API Key",
      ja: "APIキーを削除",
      ko: "API 키 삭제",
      es: "Eliminar clave API",
      "pt-BR": "Excluir chave API",
      fr: "Supprimer la clé API",
    },
    menu_btn_size: {
      en: "Set Button Size",
      "zh-TW": "設定按鈕大小",
      "zh-CN": "设置按钮大小",
      ja: "ボタンサイズを設定",
      ko: "버튼 크기 설정",
      es: "Establecer tamaño de botón",
      "pt-BR": "Definir tamanho do botão",
      fr: "Définir la taille du bouton",
    },
    menu_debug: {
      en: "Toggle Debug Mode",
      "zh-TW": "切換除錯模式",
      "zh-CN": "切换调试模式",
      ja: "デバッグモードを切替",
      ko: "디버그 모드 전환",
      es: "Alternar modo depuración",
      "pt-BR": "Alternar modo de depuração",
      fr: "Basculer le mode débogage",
    },
    menu_permanent: {
      en: "Toggle Always-On Mode",
      "zh-TW": "切換永久開啟模式",
      "zh-CN": "切换永久开启模式",
      ja: "常時オンモードを切替",
      ko: "항상 켜기 모드 전환",
      es: "Alternar modo siempre activo",
      "pt-BR": "Alternar modo sempre ativo",
      fr: "Basculer le mode toujours actif",
    },
    menu_lang: {
      en: "🌐 Language Settings",
      "zh-TW": "🌐 語言設定",
      "zh-CN": "🌐 语言设置",
      ja: "🌐 言語設定",
      ko: "🌐 언어 설정",
      es: "🌐 Configuración de idioma",
      "pt-BR": "🌐 Configurações de idioma",
      fr: "🌐 Paramètres de langue",
    },

    msg_refresh_done: {
      en: "Manual refresh completed!",
      "zh-TW": "已手動刷新完畢！",
      "zh-CN": "已手动刷新完毕！",
      ja: "手動更新が完了しました！",
      ko: "수동 새로고침 완료!",
      es: "¡Actualización manual completada!",
      "pt-BR": "Atualização manual concluída!",
      fr: "Actualisation manuelle terminée !",
    },
    msg_api_deleted: {
      en: "API Key deleted.",
      "zh-TW": "API Key 已刪除。",
      "zh-CN": "API Key 已删除。",
      ja: "APIキーが削除されました。",
      ko: "API 키가 삭제되었습니다.",
      es: "Clave API eliminada.",
      "pt-BR": "Chave API excluída.",
      fr: "Clé API supprimée.",
    },
    msg_btn_size_prompt: {
      en: "Enter button font size (e.g., 16, 18, 20)",
      "zh-TW": "輸入按鈕字體大小 (例如 16, 18, 20)",
      "zh-CN": "输入按钮字体大小 (例如 16, 18, 20)",
      ja: "ボタンのフォントサイズを入力してください (例: 16, 18, 20)",
      ko: "버튼 폰트 크기 입력 (예: 16, 18, 20)",
      es: "Ingrese el tamaño de fuente del botón (p. ej., 16, 18, 20)",
      "pt-BR": "Digite o tamanho da fonte do botão (ex.: 16, 18, 20)",
      fr: "Entrez la taille de police du bouton (ex. : 16, 18, 20)",
    },
    msg_btn_size_set: {
      en: "Button size set to {0}px. Please refresh.",
      "zh-TW": "按鈕大小已設為 {0}px，請重新載入生效。",
      "zh-CN": "按钮大小已设为 {0}px，请重新加载。",
      ja: "ボタンサイズを {0}px に設定しました。ページを再読み込みしてください。",
      ko: "버튼 크기가 {0}px로 설정되었습니다. 새로고침 해주세요.",
      es: "Tamaño de botón establecido en {0}px. Por favor, recargue.",
      "pt-BR": "Tamanho do botão definido para {0}px. Por favor, recarregue.",
      fr: "Taille du bouton définie à {0}px. Veuillez recharger.",
    },
    msg_debug_on: {
      en: "Debug Mode: ON (Reload to apply)",
      "zh-TW": "除錯模式：開啟 (請刷新頁面)",
      "zh-CN": "调试模式：开启 (请刷新页面)",
      ja: "デバッグモード: オン (ページを再読み込みしてください)",
      ko: "디버그 모드: 켜짐 (새로고침 필요)",
      es: "Modo de depuración: ACTIVADO (Recargue para aplicar)",
      "pt-BR": "Modo de depuração: ATIVADO (Recarregue para aplicar)",
      fr: "Mode débogage : ACTIVÉ (Rechargez pour appliquer)",
    },
    msg_debug_off: {
      en: "Debug Mode: OFF (Reload to apply)",
      "zh-TW": "除錯模式：關閉 (請刷新頁面)",
      "zh-CN": "调试模式：关闭 (请刷新页面)",
      ja: "デバッグモード: オフ (ページを再読み込みしてください)",
      ko: "디버그 모드: 꺼짐 (새로고침 필요)",
      es: "Modo de depuración: DESACTIVADO (Recargue para aplicar)",
      "pt-BR": "Modo de depuração: DESATIVADO (Recarregue para aplicar)",
      fr: "Mode débogage : DÉSACTIVÉ (Rechargez pour appliquer)",
    },
    msg_perm_on: {
      en: "Mode: Always On",
      "zh-TW": "已切換為「永久開啟」模式",
      "zh-CN": "已切换为「永久开启」模式",
      ja: "「常時オン」モードに切り替えました",
      ko: "「항상 켜기」모드로 전환되었습니다",
      es: "Modo: Siempre activo",
      "pt-BR": "Modo: Sempre ativo",
      fr: "Mode : Toujours actif",
    },
    msg_perm_off: {
      en: "Mode: Auto-Close (10s)",
      "zh-TW": "已關閉永久模式 (恢復 10 秒自動關閉)",
      "zh-CN": "已关闭永久模式 (恢复 10 秒自动关闭)",
      ja: "常時オンモードを無効にしました (10秒で自動クローズに戻ります)",
      ko: "항상 켜기 모드 해제 (10초 자동 닫기로 복귀)",
      es: "Modo: Cierre automático (10s)",
      "pt-BR": "Modo: Fechamento automático (10s)",
      fr: "Mode : Fermeture automatique (10s)",
    },
    msg_api_invalid_fmt: {
      en: "Invalid API Key format (too short or invalid chars)",
      "zh-TW": "API Key 格式不正確（長度過短或含無效字元）",
      "zh-CN": "API Key 格式不正确（长度过短或含无效字符）",
      ja: "APIキーの形式が無効です（短すぎるか無効な文字が含まれています）",
      ko: "API 키 형식이 올바르지 않습니다 (너무 짧거나 유효하지 않은 문자)",
      es: "Formato de clave API no válido (demasiado corta o caracteres inválidos)",
      "pt-BR": "Formato de chave API inválido (muito curta ou caracteres inválidos)",
      fr: "Format de clé API invalide (trop courte ou caractères invalides)",
    },
    msg_api_validating: {
      en: "Validating API Key...",
      "zh-TW": "正在驗證 API Key...",
      "zh-CN": "正在验证 API Key...",
      ja: "APIキーを検証しています...",
      ko: "API 키 검증 중...",
      es: "Validando clave API...",
      "pt-BR": "Validando chave API...",
      fr: "Validation de la clé API...",
    },
    msg_api_success: {
      en: "API Key Valid! Saved.",
      "zh-TW": "API Key 有效！已儲存。",
      "zh-CN": "API Key 有效！已保存。",
      ja: "APIキーが有効です！保存しました。",
      ko: "API 키가 유효합니다! 저장되었습니다.",
      es: "¡Clave API válida! Guardada.",
      "pt-BR": "Chave API válida! Salva.",
      fr: "Clé API valide ! Enregistrée.",
    },
    msg_api_fail: {
      en: "API Key Invalid or Quota Exceeded.",
      "zh-TW": "API Key 無效或配額已滿。",
      "zh-CN": "API Key 无效或配额已满。",
      ja: "APIキーが無効か、クォータを超過しています。",
      ko: "API 키가 유효하지 않거나 할당량을 초과했습니다.",
      es: "Clave API no válida o cuota superada.",
      "pt-BR": "Chave API inválida ou cota excedida.",
      fr: "Clé API invalide ou quota dépassé.",
    },

    toggle_title_detecting: {
      en: "✅ Detecting...",
      "zh-TW": "✅ 偵測中...",
      "zh-CN": "✅ 检测中...",
      ja: "✅ 検出中...",
      ko: "✅ 감지 중...",
      es: "✅ Detectando...",
      "pt-BR": "✅ Detectando...",
      fr: "✅ Détection en cours...",
    },
    toggle_title_auto_close: {
      en: "Auto-close in {0}s",
      "zh-TW": "剩餘 {0}秒 自動關閉",
      "zh-CN": "剩余 {0}秒 自动关闭",
      ja: "{0}秒後に自動クローズ",
      ko: "{0}초 후 자동 닫힘",
      es: "Cierre automático en {0}s",
      "pt-BR": "Fechamento automático em {0}s",
      fr: "Fermeture automatique dans {0}s",
    },
    toggle_title_perm: {
      en: "✅ Detecting (Always On)",
      "zh-TW": "✅ 偵測中 (永久開啟模式)",
      "zh-CN": "✅ 检测中 (永久开启模式)",
      ja: "✅ 検出中 (常時オンモード)",
      ko: "✅ 감지 중 (항상 켜기 모드)",
      es: "✅ Detectando (Siempre activo)",
      "pt-BR": "✅ Detectando (Sempre ativo)",
      fr: "✅ Détection en cours (Toujours actif)",
    },
    toggle_title_off: {
      en: "Detect YouTube Links",
      "zh-TW": "偵測 YouTube 連結",
      "zh-CN": "检测 YouTube 链接",
      ja: "YouTubeリンクを検出",
      ko: "YouTube 링크 감지",
      es: "Detectar enlaces de YouTube",
      "pt-BR": "Detectar links do YouTube",
      fr: "Détecter les liens YouTube",
    },
    toggle_desc: {
      en: "Feature: Show ▶️ Preview & 💬 Comments buttons",
      "zh-TW": "功能：顯示 ▶️預覽播放 與 💬查看留言 按鈕",
      "zh-CN": "功能：显示 ▶️预览播放 与 💬查看评论 按钮",
      ja: "機能：▶️プレビュー と 💬コメント ボタンを表示",
      ko: "기능: ▶️ 미리보기 & 💬 댓글 버튼 표시",
      es: "Función: Mostrar botones ▶️ Vista previa y 💬 Comentarios",
      "pt-BR": "Função: Exibir botões ▶️ Visualização prévia e 💬 Comentários",
      fr: "Fonction : Afficher les boutons ▶️ Aperçu et 💬 Commentaires",
    },
    toggle_instr_click: {
      en: "• Click: Open for 10s",
      "zh-TW": "• 點擊：開啟 10 秒",
      "zh-CN": "• 点击：开启 10 秒",
      ja: "• クリック: 10秒間開く",
      ko: "• 클릭: 10초 동안 열기",
      es: "• Clic: Abrir 10s",
      "pt-BR": "• Clique: Abrir por 10s",
      fr: "• Clic : Ouvrir 10s",
    },
    toggle_instr_lock: {
      en: "• Hold 1s: Lock Always-On",
      "zh-TW": "• 長按 1 秒：鎖定為永久開啟",
      "zh-CN": "• 长按 1 秒：锁定为永久开启",
      ja: "• 1秒長押し: 常時オンにロック",
      ko: "• 1초 길게 누르기: 항상 켜기 잠금",
      es: "• Mantener 1s: Bloquear siempre activo",
      "pt-BR": "• Segurar 1s: Bloquear sempre ativo",
      fr: "• Maintenir 1s : Verrouiller toujours actif",
    },
    toggle_instr_close: {
      en: "• Click: Turn Off",
      "zh-TW": "• 點擊：關閉功能",
      "zh-CN": "• 点击：关闭功能",
      ja: "• クリック: オフにする",
      ko: "• 클릭: 기능 끄기",
      es: "• Clic: Desactivar",
      "pt-BR": "• Clique: Desativar",
      fr: "• Clic : Désactiver",
    },
    toggle_instr_hold: {
      en: "• Hold 0.5s: Open Mode Menu",
      "zh-TW": "• 長按 0.5 秒：開啟模式選單",
      "zh-CN": "• 长按 0.5 秒：打开模式菜单",
      ja: "• 0.5秒長押し: モードメニューを開く",
      ko: "• 0.5초 길게 누르기: 모드 메뉴 열기",
      es: "• Mantener 0.5s: Abrir menú de modos",
      "pt-BR": "• Segurar 0,5s: Abrir menu de modos",
      fr: "• Maintenir 0.5s : Ouvrir le menu des modes",
    },

    lp_menu_title: {
      en: "YouTube Scan Settings",
      "zh-TW": "YouTube 掃描設定",
      "zh-CN": "YouTube 扫描设置",
      ja: "YouTube スキャン設定",
      ko: "YouTube 스캔 설정",
      es: "Configuración de escaneo de YouTube",
      "pt-BR": "Configurações de varredura do YouTube",
      fr: "Paramètres de scan YouTube",
    },
    lp_scan_10s_label: {
      en: "10s Scan",
      "zh-TW": "10 秒掃描",
      "zh-CN": "10 秒扫描",
      ja: "10秒スキャン",
      ko: "10초 스캔",
      es: "Escaneo 10s",
      "pt-BR": "Varredura 10s",
      fr: "Scan 10s",
    },
    lp_scan_10s_desc: {
      en: "Open and auto-close after 10s",
      "zh-TW": "開啟並在 10 秒後自動關閉",
      "zh-CN": "开启并在 10 秒后自动关闭",
      ja: "開いて10秒後に自動クローズ",
      ko: "열고 10초 후 자동 닫기",
      es: "Abrir y cerrar automáticamente después de 10s",
      "pt-BR": "Abrir e fechar automaticamente após 10s",
      fr: "Ouvrir et fermer automatiquement après 10s",
    },
    lp_perm_label: {
      en: "Always-On Mode",
      "zh-TW": "永久開啟模式",
      "zh-CN": "永久开启模式",
      ja: "常時オンモード",
      ko: "항상 켜기 모드",
      es: "Modo siempre activo",
      "pt-BR": "Modo sempre ativo",
      fr: "Mode toujours actif",
    },
    lp_perm_desc: {
      en: "Continuous detection, no auto-close",
      "zh-TW": "持續偵測，不自動關閉",
      "zh-CN": "持续检测，不自动关闭",
      ja: "継続検出、自動クローズなし",
      ko: "지속 감지, 자동 닫기 없음",
      es: "Detección continua, sin cierre automático",
      "pt-BR": "Detecção contínua, sem fechamento automático",
      fr: "Détection continue, sans fermeture automatique",
    },
    lp_unperm_label: {
      en: "Disable Always-On",
      "zh-TW": "解除永久模式",
      "zh-CN": "解除永久模式",
      ja: "常時オンを解除",
      ko: "항상 켜기 해제",
      es: "Desactivar siempre activo",
      "pt-BR": "Desativar sempre ativo",
      fr: "Désactiver toujours actif",
    },
    lp_unperm_desc: {
      en: "Switch to 10s auto-close",
      "zh-TW": "改為 10 秒後自動關閉",
      "zh-CN": "改为 10 秒后自动关闭",
      ja: "10秒自動クローズに切り替え",
      ko: "10초 자동 닫기로 전환",
      es: "Cambiar a cierre automático de 10s",
      "pt-BR": "Mudar para fechamento automático de 10s",
      fr: "Passer à la fermeture automatique de 10s",
    },
    lp_stop_label: {
      en: "Stop Scanning",
      "zh-TW": "關閉掃描",
      "zh-CN": "关闭扫描",
      ja: "スキャン停止",
      ko: "스캔 중지",
      es: "Detener escaneo",
      "pt-BR": "Parar varredura",
      fr: "Arrêter le scan",
    },
    lp_stop_desc: {
      en: "Remove all ▶️ buttons",
      "zh-TW": "移除所有 ▶️ 按鈕",
      "zh-CN": "移除所有 ▶️ 按钮",
      ja: "すべての ▶️ ボタンを削除",
      ko: "모든 ▶️ 버튼 제거",
      es: "Eliminar todos los botones ▶️",
      "pt-BR": "Remover todos os botões ▶️",
      fr: "Supprimer tous les boutons ▶️",
    },
    lp_lock_label: {
      en: "Lock Always-On",
      "zh-TW": "鎖定永久模式",
      "zh-CN": "锁定永久模式",
      ja: "常時オンをロック",
      ko: "항상 켜기 잠금",
      es: "Bloquear siempre activo",
      "pt-BR": "Bloquear sempre ativo",
      fr: "Verrouiller toujours actif",
    },
    lp_lock_desc: {
      en: "Cancel countdown, keep scanning",
      "zh-TW": "取消倒數，持續偵測",
      "zh-CN": "取消倒计时，持续检测",
      ja: "カウントダウンをキャンセルして継続",
      ko: "카운트다운 취소, 계속 감지",
      es: "Cancelar cuenta regresiva, seguir escaneando",
      "pt-BR": "Cancelar contagem regressiva, continuar varrendo",
      fr: "Annuler le compte à rebours, continuer le scan",
    },
    lp_close_label: {
      en: "Close Now",
      "zh-TW": "立即關閉",
      "zh-CN": "立即关闭",
      ja: "今すぐ閉じる",
      ko: "지금 닫기",
      es: "Cerrar ahora",
      "pt-BR": "Fechar agora",
      fr: "Fermer maintenant",
    },
    lp_close_desc: {
      en: "Stop scan and remove buttons",
      "zh-TW": "停止掃描並移除按鈕",
      "zh-CN": "停止扫描并移除按钮",
      ja: "スキャンを停止してボタンを削除",
      ko: "스캔 중지 및 버튼 제거",
      es: "Detener escaneo y eliminar botones",
      "pt-BR": "Parar varredura e remover botões",
      fr: "Arrêter le scan et supprimer les boutons",
    },
    lp_1h_label: {
      en: "Close After 1 Hour",
      "zh-TW": "1 小時後關閉",
      "zh-CN": "1 小时后关闭",
      ja: "1時間後に閉じる",
      ko: "1시간 후 종료",
      es: "Cerrar después de 1 hora",
      "pt-BR": "Fechar após 1 hora",
      fr: "Fermer après 1 heure",
    },
    lp_1h_desc: {
      en: "Always-on scan, then auto-off after 1h",
      "zh-TW": "持續掃描，1 小時後自動關閉發光",
      "zh-CN": "持续扫描，1 小时后自动关闭发光",
      ja: "常時スキャン後、1時間後に自動オフ",
      ko: "항상 켜기 스캔, 1시간 후 자동 종료",
      es: "Escaneo siempre activo, luego apagado automático después de 1h",
      "pt-BR": "Varredura sempre ativa, depois desligamento automático após 1h",
      fr: "Scan toujours actif, puis arrêt automatique après 1h",
    },
    lp_disabled_10s: {
      en: "10s Scan (Unavailable in Always-On)",
      "zh-TW": "10 秒掃描（永久模式中不可用）",
      "zh-CN": "10 秒扫描（永久模式中不可用）",
      ja: "10秒スキャン（常時オン中は使用不可）",
      ko: "10초 스캔 (항상 켜기 중 사용 불가)",
      es: "Escaneo 10s (No disponible en modo siempre activo)",
      "pt-BR": "Varredura 10s (Indisponível no modo sempre ativo)",
      fr: "Scan 10s (Indisponible en mode toujours actif)",
    },
    lp_wake_label: {
      en: "Wake Up Scan",
      "zh-TW": "喚醒掃描",
      "zh-CN": "唤醒扫描",
      ja: "スキャンを再開",
      ko: "스캔 재개",
      es: "Reactivar escaneo",
      "pt-BR": "Reativar varredura",
      fr: "Réactiver le scan",
    },
    lp_wake_desc: {
      en: "Resume always-on scanning",
      "zh-TW": "恢復持續偵測模式",
      "zh-CN": "恢复持续检测模式",
      ja: "常時スキャンを再開",
      ko: "항상 켜기 스캔 재개",
      es: "Reanudar escaneo siempre activo",
      "pt-BR": "Retomar varredura sempre ativa",
      fr: "Reprendre le scan toujours actif",
    },
    lp_sleeping_label: {
      en: "Sleeping (Auto-Paused)",
      "zh-TW": "休眠中（自動暫停）",
      "zh-CN": "休眠中（自动暂停）",
      ja: "スリープ中（自動一時停止）",
      ko: "절전 중 (자동 일시 정지)",
      es: "En reposo (Pausado automáticamente)",
      "pt-BR": "Em repouso (Pausado automaticamente)",
      fr: "En veille (Pause automatique)",
    },
    lp_sleeping_desc: {
      en: "Paused after {0}h — click Wake Up to resume",
      "zh-TW": "超過 {0} 小時後自動暫停，點喚醒繼續",
      "zh-CN": "超过 {0} 小时后自动暂停，点唤醒继续",
      ja: "{0}時間後に自動一時停止 — 再開するには「再開」を",
      ko: "{0}시간 후 자동 일시 정지 — 재개하려면 '재개' 클릭",
      es: "Pausado después de {0}h — haz clic en Reactivar para continuar",
      "pt-BR": "Pausado após {0}h — clique em Reativar para continuar",
      fr: "Pausé après {0}h — cliquez sur Réactiver pour reprendre",
    },
    menu_sleep_duration: {
      en: "Set Auto-Sleep Duration",
      "zh-TW": "設定自動休眠時間",
      "zh-CN": "设置自动休眠时间",
      ja: "自動スリープ時間を設定",
      ko: "자동 절전 시간 설정",
      es: "Configurar duración de reposo automático",
      "pt-BR": "Configurar duração do repouso automático",
      fr: "Définir la durée de mise en veille automatique",
    },
    msg_sleep_set: {
      en: "Auto-sleep set to {0} hour(s). Reload to apply.",
      "zh-TW": "自動休眠已設為 {0} 小時，請重新載入。",
      "zh-CN": "自动休眠已设为 {0} 小时，请重新加载。",
      ja: "自動スリープを {0} 時間に設定しました。再読み込みしてください。",
      ko: "자동 절전이 {0}시간으로 설정되었습니다. 새로고침 필요.",
      es: "Reposo automático configurado a {0} hora(s). Recargue para aplicar.",
      "pt-BR": "Repouso automático definido para {0} hora(s). Recarregue para aplicar.",
      fr: "Mise en veille automatique définie à {0} heure(s). Rechargez pour appliquer.",
    },
    msg_sleep_prompt: {
      en: "Enter auto-sleep duration in hours (e.g. 3, min 0.5):",
      "zh-TW": "輸入自動休眠時數（例如 3，最少 0.5）：",
      "zh-CN": "输入自动休眠小时数（例如 3，最少 0.5）：",
      ja: "自動スリープ時間を時間単位で入力（例: 3、最低0.5）:",
      ko: "자동 절전 시간을 시간 단위로 입력 (예: 3, 최소 0.5):",
      es: "Ingrese la duración del reposo automático en horas (p. ej., 3, mín. 0.5):",
      "pt-BR": "Digite a duração do repouso automático em horas (ex.: 3, mín. 0,5):",
      fr: "Entrez la durée de mise en veille automatique en heures (ex. : 3, min. 0,5) :",
    },

    btn_play_tooltip: {
      en: "Preview (Hold 0.7s for No-Cookie)",
      "zh-TW": "預覽影片 (長按 0.7 秒切換 No-Cookie)",
      "zh-CN": "预览视频 (长按 0.7 秒切换 No-Cookie)",
      ja: "プレビュー (0.7秒長押しでNo-Cookieモード)",
      ko: "미리보기 (0.7초 길게 누르면 No-Cookie 전환)",
      es: "Vista previa (Mantener 0.7s para modo Sin Cookie)",
      "pt-BR": "Visualização prévia (Segurar 0,7s para modo Sem Cookie)",
      fr: "Aperçu (Maintenir 0,7s pour le mode Sans Cookie)",
    },
    btn_comment_tooltip: {
      en: "View Comments",
      "zh-TW": "查看留言",
      "zh-CN": "查看评论",
      ja: "コメントを見る",
      ko: "댓글 보기",
      es: "Ver comentarios",
      "pt-BR": "Ver comentários",
      fr: "Voir les commentaires",
    },

    player_resize: {
      en: "Resize",
      "zh-TW": "切換大小",
      "zh-CN": "切换大小",
      ja: "サイズ変更",
      ko: "크기 조절",
      es: "Cambiar tamaño",
      "pt-BR": "Redimensionar",
      fr: "Redimensionner",
    },
    player_nocookie: {
      en: "No-Cookie Mode",
      "zh-TW": "No-Cookie 模式",
      "zh-CN": "No-Cookie 模式",
      ja: "No-Cookieモード",
      ko: "No-Cookie 모드",
      es: "Modo sin cookie",
      "pt-BR": "Modo sem cookie",
      fr: "Mode sans cookie",
    },

    ui_sort: {
      en: "Sort:",
      "zh-TW": "排序：",
      "zh-CN": "排序：",
      ja: "並べ替え：",
      ko: "정렬:",
      es: "Ordenar:",
      "pt-BR": "Ordenar:",
      fr: "Trier :",
    },
    ui_sort_top: {
      en: "Top",
      "zh-TW": "熱門",
      "zh-CN": "热门",
      ja: "人気順",
      ko: "인기순",
      es: "Popular",
      "pt-BR": "Popular",
      fr: "Populaire",
    },
    ui_sort_new: {
      en: "Newest",
      "zh-TW": "最新",
      "zh-CN": "最新",
      ja: "新しい順",
      ko: "최신순",
      es: "Más reciente",
      "pt-BR": "Mais recente",
      fr: "Plus récent",
    },
    ui_count: {
      en: "Count:",
      "zh-TW": "數量：",
      "zh-CN": "数量：",
      ja: "件数：",
      ko: "개수:",
      es: "Cantidad:",
      "pt-BR": "Quantidade:",
      fr: "Nombre :",
    },
    ui_lang_ph: {
      en: "Translate",
      "zh-TW": "翻譯",
      "zh-CN": "翻译",
      ja: "翻訳",
      ko: "번역",
      es: "Traducir",
      "pt-BR": "Traduzir",
      fr: "Traduire",
    },
    ui_lang_zh: {
      en: "Trad. Chinese",
      "zh-TW": "繁體中文",
      "zh-CN": "繁體中文",
      ja: "繁体字中国語",
      ko: "번체 중국어",
      es: "Chino tradicional",
      "pt-BR": "Chinês tradicional",
      fr: "Chinois traditionnel",
    },
    ui_lang_cn: {
      en: "Simp. Chinese",
      "zh-TW": "簡體中文",
      "zh-CN": "简体中文",
      ja: "簡体字中国語",
      ko: "간체 중국어",
      es: "Chino simplificado",
      "pt-BR": "Chinês simplificado",
      fr: "Chinois simplifié",
    },
    ui_lang_en: {
      en: "English",
      "zh-TW": "英文",
      "zh-CN": "英文",
      ja: "英語",
      ko: "영어",
      es: "Inglés",
      "pt-BR": "Inglês",
      fr: "Anglais",
    },
    ui_lang_ja: {
      en: "Japanese",
      "zh-TW": "日文",
      "zh-CN": "日文",
      ja: "日本語",
      ko: "일본어",
      es: "Japonés",
      "pt-BR": "Japonês",
      fr: "Japonais",
    },
    ui_lang_ko: {
      en: "Korean",
      "zh-TW": "韓文",
      "zh-CN": "韩文",
      ja: "韓国語",
      ko: "한국어",
      es: "Coreano",
      "pt-BR": "Coreano",
      fr: "Coréen",
    },
    ui_lang_fr: {
      en: "French",
      "zh-TW": "法文",
      "zh-CN": "法文",
      ja: "フランス語",
      ko: "프랑스어",
      es: "Francés",
      "pt-BR": "Francês",
      fr: "Français",
    },
    ui_lang_de: {
      en: "German",
      "zh-TW": "德文",
      "zh-CN": "德文",
      ja: "ドイツ語",
      ko: "독일어",
      es: "Alemán",
      "pt-BR": "Alemão",
      fr: "Allemand",
    },
    ui_lang_es: {
      en: "Spanish",
      "zh-TW": "西班牙文",
      "zh-CN": "西班牙文",
      ja: "スペイン語",
      ko: "스페인어",
      es: "Español",
      "pt-BR": "Espanhol",
      fr: "Espagnol",
    },
    ui_lang_pt: {
      en: "Portuguese",
      "zh-TW": "葡萄牙文",
      "zh-CN": "葡萄牙文",
      ja: "ポルトガル語",
      ko: "포르투갈어",
      es: "Portugués",
      "pt-BR": "Português",
      fr: "Portugais",
    },
    ui_lang_it: {
      en: "Italian",
      "zh-TW": "義大利文",
      "zh-CN": "意大利文",
      ja: "イタリア語",
      ko: "이탈리아어",
      es: "Italiano",
      "pt-BR": "Italiano",
      fr: "Italien",
    },
    ui_lang_ru: {
      en: "Russian",
      "zh-TW": "俄文",
      "zh-CN": "俄文",
      ja: "ロシア語",
      ko: "러시아어",
      es: "Ruso",
      "pt-BR": "Russo",
      fr: "Russe",
    },
    ui_lang_ar: {
      en: "Arabic",
      "zh-TW": "阿拉伯文",
      "zh-CN": "阿拉伯文",
      ja: "アラビア語",
      ko: "아랍어",
      es: "Árabe",
      "pt-BR": "Árabe",
      fr: "Arabe",
    },
    ui_lang_hi: {
      en: "Hindi",
      "zh-TW": "印地文",
      "zh-CN": "印地文",
      ja: "ヒンディー語",
      ko: "힌디어",
      es: "Hindi",
      "pt-BR": "Hindi",
      fr: "Hindi",
    },
    ui_lang_th: {
      en: "Thai",
      "zh-TW": "泰文",
      "zh-CN": "泰文",
      ja: "タイ語",
      ko: "태국어",
      es: "Tailandés",
      "pt-BR": "Tailandês",
      fr: "Thaïlandais",
    },
    ui_lang_vi: {
      en: "Vietnamese",
      "zh-TW": "越南文",
      "zh-CN": "越南文",
      ja: "ベトナム語",
      ko: "베트남어",
      es: "Vietnamita",
      "pt-BR": "Vietnamita",
      fr: "Vietnamien",
    },
    ui_lang_id: {
      en: "Indonesian",
      "zh-TW": "印尼文",
      "zh-CN": "印尼文",
      ja: "インドネシア語",
      ko: "인도네시아어",
      es: "Indonesio",
      "pt-BR": "Indonésio",
      fr: "Indonésien",
    },
    ui_lang_ms: {
      en: "Malay",
      "zh-TW": "馬來文",
      "zh-CN": "马来文",
      ja: "マレー語",
      ko: "말레이어",
      es: "Malayo",
      "pt-BR": "Malaio",
      fr: "Malais",
    },
    ui_lang_tr: {
      en: "Turkish",
      "zh-TW": "土耳其文",
      "zh-CN": "土耳其文",
      ja: "トルコ語",
      ko: "터키어",
      es: "Turco",
      "pt-BR": "Turco",
      fr: "Turc",
    },
    ui_lang_pl: {
      en: "Polish",
      "zh-TW": "波蘭文",
      "zh-CN": "波兰文",
      ja: "ポーランド語",
      ko: "폴란드어",
      es: "Polaco",
      "pt-BR": "Polonês",
      fr: "Polonais",
    },
    ui_lang_nl: {
      en: "Dutch",
      "zh-TW": "荷蘭文",
      "zh-CN": "荷兰文",
      ja: "オランダ語",
      ko: "네덜란드어",
      es: "Neerlandés",
      "pt-BR": "Holandês",
      fr: "Néerlandais",
    },
    ui_lang_sv: {
      en: "Swedish",
      "zh-TW": "瑞典文",
      "zh-CN": "瑞典文",
      ja: "スウェーデン語",
      ko: "스웨덴어",
      es: "Sueco",
      "pt-BR": "Sueco",
      fr: "Suédois",
    },
    ui_lang_no: {
      en: "Norwegian",
      "zh-TW": "挪威文",
      "zh-CN": "挪威文",
      ja: "ノルウェー語",
      ko: "노르웨이어",
      es: "Noruego",
      "pt-BR": "Norueguês",
      fr: "Norvégien",
    },
    ui_lang_da: {
      en: "Danish",
      "zh-TW": "丹麥文",
      "zh-CN": "丹麦文",
      ja: "デンマーク語",
      ko: "덴마크어",
      es: "Danés",
      "pt-BR": "Dinamarquês",
      fr: "Danois",
    },
    ui_lang_fi: {
      en: "Finnish",
      "zh-TW": "芬蘭文",
      "zh-CN": "芬兰文",
      ja: "フィンランド語",
      ko: "핀란드어",
      es: "Finlandés",
      "pt-BR": "Finlandês",
      fr: "Finnois",
    },
    ui_lang_cs: {
      en: "Czech",
      "zh-TW": "捷克文",
      "zh-CN": "捷克文",
      ja: "チェコ語",
      ko: "체코어",
      es: "Checo",
      "pt-BR": "Tcheco",
      fr: "Tchèque",
    },
    ui_lang_hu: {
      en: "Hungarian",
      "zh-TW": "匈牙利文",
      "zh-CN": "匈牙利文",
      ja: "ハンガリー語",
      ko: "헝가리어",
      es: "Húngaro",
      "pt-BR": "Húngaro",
      fr: "Hongrois",
    },
    ui_lang_ro: {
      en: "Romanian",
      "zh-TW": "羅馬尼亞文",
      "zh-CN": "罗马尼亚文",
      ja: "ルーマニア語",
      ko: "루마니아어",
      es: "Rumano",
      "pt-BR": "Romeno",
      fr: "Roumain",
    },
    ui_lang_uk: {
      en: "Ukrainian",
      "zh-TW": "烏克蘭文",
      "zh-CN": "乌克兰文",
      ja: "ウクライナ語",
      ko: "우크라이나어",
      es: "Ucraniano",
      "pt-BR": "Ucraniano",
      fr: "Ukrainien",
    },
    ui_lang_el: {
      en: "Greek",
      "zh-TW": "希臘文",
      "zh-CN": "希腊文",
      ja: "ギリシャ語",
      ko: "그리스어",
      es: "Griego",
      "pt-BR": "Grego",
      fr: "Grec",
    },
    ui_lang_he: {
      en: "Hebrew",
      "zh-TW": "希伯來文",
      "zh-CN": "希伯来文",
      ja: "ヘブライ語",
      ko: "히브리어",
      es: "Hebreo",
      "pt-BR": "Hebraico",
      fr: "Hébreu",
    },
    ui_lang_fa: {
      en: "Persian",
      "zh-TW": "波斯文",
      "zh-CN": "波斯文",
      ja: "ペルシャ語",
      ko: "페르시아어",
      es: "Persa",
      "pt-BR": "Persa",
      fr: "Persan",
    },
    ui_lang_bn: {
      en: "Bengali",
      "zh-TW": "孟加拉文",
      "zh-CN": "孟加拉文",
      ja: "ベンガル語",
      ko: "벵골어",
      es: "Bengalí",
      "pt-BR": "Bengali",
      fr: "Bengali",
    },
    ui_lang_ur: {
      en: "Urdu",
      "zh-TW": "烏爾都文",
      "zh-CN": "乌尔都文",
      ja: "ウルドゥー語",
      ko: "우르두어",
      es: "Urdu",
      "pt-BR": "Urdu",
      fr: "Ourdou",
    },
    ui_lang_tl: {
      en: "Filipino",
      "zh-TW": "菲律賓文",
      "zh-CN": "菲律宾文",
      ja: "フィリピン語",
      ko: "필리핀어",
      es: "Filipino",
      "pt-BR": "Filipino",
      fr: "Filipino",
    },
    ui_lang_sw: {
      en: "Swahili",
      "zh-TW": "斯瓦希里文",
      "zh-CN": "斯瓦希里文",
      ja: "スワヒリ語",
      ko: "스와힐리어",
      es: "Suajili",
      "pt-BR": "Suaíli",
      fr: "Swahili",
    },
    ui_lang_af: {
      en: "Afrikaans",
      "zh-TW": "南非荷蘭文",
      "zh-CN": "南非荷兰文",
      ja: "アフリカーンス語",
      ko: "아프리칸스어",
      es: "Afrikáans",
      "pt-BR": "Africâner",
      fr: "Afrikaans",
    },
    ui_lang_ca: {
      en: "Catalan",
      "zh-TW": "加泰隆尼亞文",
      "zh-CN": "加泰隆尼亚文",
      ja: "カタロニア語",
      ko: "카탈로니아어",
      es: "Catalán",
      "pt-BR": "Catalão",
      fr: "Catalan",
    },
    ui_lang_hr: {
      en: "Croatian",
      "zh-TW": "克羅埃西亞文",
      "zh-CN": "克罗地亚文",
      ja: "クロアチア語",
      ko: "크로아티아어",
      es: "Croata",
      "pt-BR": "Croata",
      fr: "Croate",
    },
    ui_lang_sk: {
      en: "Slovak",
      "zh-TW": "斯洛伐克文",
      "zh-CN": "斯洛伐克文",
      ja: "スロバキア語",
      ko: "슬로바키아어",
      es: "Eslovaco",
      "pt-BR": "Eslovaco",
      fr: "Slovaque",
    },
    ui_lang_bg: {
      en: "Bulgarian",
      "zh-TW": "保加利亞文",
      "zh-CN": "保加利亚文",
      ja: "ブルガリア語",
      ko: "불가리아어",
      es: "Búlgaro",
      "pt-BR": "Búlgaro",
      fr: "Bulgare",
    },
    ui_lang_sr: {
      en: "Serbian",
      "zh-TW": "塞爾維亞文",
      "zh-CN": "塞尔维亚文",
      ja: "セルビア語",
      ko: "세르비아어",
      es: "Serbio",
      "pt-BR": "Sérvio",
      fr: "Serbe",
    },
    ui_lang_lt: {
      en: "Lithuanian",
      "zh-TW": "立陶宛文",
      "zh-CN": "立陶宛文",
      ja: "リトアニア語",
      ko: "리투아니아어",
      es: "Lituano",
      "pt-BR": "Lituano",
      fr: "Lituanien",
    },
    ui_lang_lv: {
      en: "Latvian",
      "zh-TW": "拉脫維亞文",
      "zh-CN": "拉脱维亚文",
      ja: "ラトビア語",
      ko: "라트비아어",
      es: "Letón",
      "pt-BR": "Letão",
      fr: "Letton",
    },
    ui_lang_et: {
      en: "Estonian",
      "zh-TW": "愛沙尼亞文",
      "zh-CN": "爱沙尼亚文",
      ja: "エストニア語",
      ko: "에스토니아어",
      es: "Estonio",
      "pt-BR": "Estoniano",
      fr: "Estonien",
    },
    ui_lang_sl: {
      en: "Slovenian",
      "zh-TW": "斯洛維尼亞文",
      "zh-CN": "斯洛文尼亚文",
      ja: "スロベニア語",
      ko: "슬로베니아어",
      es: "Esloveno",
      "pt-BR": "Esloveno",
      fr: "Slovène",
    },
    ui_lang_mk: {
      en: "Macedonian",
      "zh-TW": "馬其頓文",
      "zh-CN": "马其顿文",
      ja: "マケドニア語",
      ko: "마케도니아어",
      es: "Macedonio",
      "pt-BR": "Macedônio",
      fr: "Macédonien",
    },
    ui_lang_sq: {
      en: "Albanian",
      "zh-TW": "阿爾巴尼亞文",
      "zh-CN": "阿尔巴尼亚文",
      ja: "アルバニア語",
      ko: "알바니아어",
      es: "Albanés",
      "pt-BR": "Albanês",
      fr: "Albanais",
    },
    ui_lang_mt: {
      en: "Maltese",
      "zh-TW": "馬爾他文",
      "zh-CN": "马耳他文",
      ja: "マルタ語",
      ko: "몰타어",
      es: "Maltés",
      "pt-BR": "Maltês",
      fr: "Maltais",
    },
    ui_lang_is: {
      en: "Icelandic",
      "zh-TW": "冰島文",
      "zh-CN": "冰岛文",
      ja: "アイスランド語",
      ko: "아이슬란드어",
      es: "Islandés",
      "pt-BR": "Islandês",
      fr: "Islandais",
    },
    ui_lang_az: {
      en: "Azerbaijani",
      "zh-TW": "亞塞拜然文",
      "zh-CN": "阿塞拜疆文",
      ja: "アゼルバイジャン語",
      ko: "아제르바이잔어",
      es: "Azerbaiyano",
      "pt-BR": "Azerbaijano",
      fr: "Azerbaïdjanais",
    },
    ui_lang_ka: {
      en: "Georgian",
      "zh-TW": "喬治亞文",
      "zh-CN": "格鲁吉亚文",
      ja: "ジョージア語",
      ko: "조지아어",
      es: "Georgiano",
      "pt-BR": "Georgiano",
      fr: "Géorgien",
    },
    ui_lang_hy: {
      en: "Armenian",
      "zh-TW": "亞美尼亞文",
      "zh-CN": "亚美尼亚文",
      ja: "アルメニア語",
      ko: "아르메니아어",
      es: "Armenio",
      "pt-BR": "Armênio",
      fr: "Arménien",
    },
    ui_lang_kk: {
      en: "Kazakh",
      "zh-TW": "哈薩克文",
      "zh-CN": "哈萨克文",
      ja: "カザフ語",
      ko: "카자흐어",
      es: "Kazajo",
      "pt-BR": "Cazaque",
      fr: "Kazakh",
    },
    ui_lang_uz: {
      en: "Uzbek",
      "zh-TW": "烏茲別克文",
      "zh-CN": "乌兹别克文",
      ja: "ウズベク語",
      ko: "우즈베크어",
      es: "Uzbeko",
      "pt-BR": "Uzbeque",
      fr: "Ouzbek",
    },
    ui_lang_mn: {
      en: "Mongolian",
      "zh-TW": "蒙古文",
      "zh-CN": "蒙古文",
      ja: "モンゴル語",
      ko: "몽골어",
      es: "Mongol",
      "pt-BR": "Mongol",
      fr: "Mongol",
    },
    ui_lang_ne: {
      en: "Nepali",
      "zh-TW": "尼泊爾文",
      "zh-CN": "尼泊尔文",
      ja: "ネパール語",
      ko: "네팔어",
      es: "Nepalés",
      "pt-BR": "Nepali",
      fr: "Népalais",
    },
    ui_lang_si: {
      en: "Sinhala",
      "zh-TW": "僧伽羅文",
      "zh-CN": "僧伽罗文",
      ja: "シンハラ語",
      ko: "신할라어",
      es: "Cingalés",
      "pt-BR": "Cingalês",
      fr: "Cingalais",
    },
    ui_lang_km: {
      en: "Khmer",
      "zh-TW": "高棉文",
      "zh-CN": "高棉文",
      ja: "クメール語",
      ko: "크메르어",
      es: "Jemer",
      "pt-BR": "Khmer",
      fr: "Khmer",
    },
    ui_lang_lo: {
      en: "Lao",
      "zh-TW": "寮文",
      "zh-CN": "老挝文",
      ja: "ラオ語",
      ko: "라오어",
      es: "Laosiano",
      "pt-BR": "Laosiano",
      fr: "Laotien",
    },
    ui_lang_my: {
      en: "Burmese",
      "zh-TW": "緬甸文",
      "zh-CN": "缅甸文",
      ja: "ビルマ語",
      ko: "버마어",
      es: "Birmano",
      "pt-BR": "Birmanês",
      fr: "Birman",
    },
    ui_lang_am: {
      en: "Amharic",
      "zh-TW": "阿姆哈拉文",
      "zh-CN": "阿姆哈拉文",
      ja: "アムハラ語",
      ko: "암하라어",
      es: "Amhárico",
      "pt-BR": "Amárico",
      fr: "Amharique",
    },
    ui_lang_yo: {
      en: "Yoruba",
      "zh-TW": "約魯巴文",
      "zh-CN": "约鲁巴文",
      ja: "ヨルバ語",
      ko: "요루바어",
      es: "Yoruba",
      "pt-BR": "Iorubá",
      fr: "Yoruba",
    },
    ui_lang_ig: {
      en: "Igbo",
      "zh-TW": "伊博文",
      "zh-CN": "伊博文",
      ja: "イボ語",
      ko: "이그보어",
      es: "Igbo",
      "pt-BR": "Igbo",
      fr: "Igbo",
    },
    ui_lang_ha: {
      en: "Hausa",
      "zh-TW": "豪薩文",
      "zh-CN": "豪萨文",
      ja: "ハウサ語",
      ko: "하우사어",
      es: "Hausa",
      "pt-BR": "Hausa",
      fr: "Haoussa",
    },
    ui_lang_zu: {
      en: "Zulu",
      "zh-TW": "祖魯文",
      "zh-CN": "祖鲁文",
      ja: "ズールー語",
      ko: "줄루어",
      es: "Zulú",
      "pt-BR": "Zulu",
      fr: "Zoulou",
    },
    ui_search_ph: {
      en: "Search comments...",
      "zh-TW": "搜尋留言...",
      "zh-CN": "搜索评论...",
      ja: "コメントを検索...",
      ko: "댓글 검색...",
      es: "Buscar comentarios...",
      "pt-BR": "Pesquisar comentários...",
      fr: "Rechercher des commentaires...",
    },
    ui_btn_float: {
      en: "▶️ Float",
      "zh-TW": "▶️ 小窗",
      "zh-CN": "▶️ 小窗",
      ja: "▶️ フロート",
      ko: "▶️ 플로팅",
      es: "▶️ Flotante",
      "pt-BR": "▶️ Flutuante",
      fr: "▶️ Flottant",
    },
    ui_btn_api: {
      en: "⚙️ API",
      "zh-TW": "⚙️ 設定API",
      "zh-CN": "⚙️ 设置API",
      ja: "⚙️ API設定",
      ko: "⚙️ API 설정",
      es: "⚙️ API",
      "pt-BR": "⚙️ API",
      fr: "⚙️ API",
    },
    ui_title_comments: {
      en: "Comments Preview",
      "zh-TW": "留言預覽",
      "zh-CN": "评论预览",
      ja: "コメントプレビュー",
      ko: "댓글 미리보기",
      es: "Vista previa de comentarios",
      "pt-BR": "Pré-visualização de comentários",
      fr: "Aperçu des commentaires",
    },
    ui_btn_prev: {
      en: "⬅ Prev",
      "zh-TW": "⬅ 上一頁",
      "zh-CN": "⬅ 上一页",
      ja: "⬅ 前へ",
      ko: "⬅ 이전",
      es: "⬅ Anterior",
      "pt-BR": "⬅ Anterior",
      fr: "⬅ Précédent",
    },
    ui_btn_next: {
      en: "Next ➡",
      "zh-TW": "下一頁 ➡",
      "zh-CN": "下一页 ➡",
      ja: "次へ ➡",
      ko: "다음 ➡",
      es: "Siguiente ➡",
      "pt-BR": "Próximo ➡",
      fr: "Suivant ➡",
    },
    ui_loading: {
      en: "Loading...",
      "zh-TW": "載入中...",
      "zh-CN": "加载中...",
      ja: "読み込み中...",
      ko: "로딩 중...",
      es: "Cargando...",
      "pt-BR": "Carregando...",
      fr: "Chargement...",
    },
    ui_no_comments: {
      en: "❌ No comments found",
      "zh-TW": "❌ 無留言可顯示",
      "zh-CN": "❌ 无评论可显示",
      ja: "❌ コメントが見つかりません",
      ko: "❌ 댓글을 찾을 수 없습니다",
      es: "❌ No se encontraron comentarios",
      "pt-BR": "❌ Nenhum comentário encontrado",
      fr: "❌ Aucun commentaire trouvé",
    },
    ui_err_disabled: {
      en: "❌ Comments are disabled for this video",
      "zh-TW": "❌ 此影片已禁用留言",
      "zh-CN": "❌ 此视频已禁用评论",
      ja: "❌ この動画のコメントは無効です",
      ko: "❌ 이 동영상의 댓글이 비활성화되어 있습니다",
      es: "❌ Los comentarios están desactivados para este vídeo",
      "pt-BR": "❌ Os comentários estão desativados para este vídeo",
      fr: "❌ Les commentaires sont désactivés pour cette vidéo",
    },
    ui_err_quota: {
      en: "❌ API Quota Exceeded",
      "zh-TW": "❌ API 配額已達上限",
      "zh-CN": "❌ API 配额已达上限",
      ja: "❌ APIクォータを超過しました",
      ko: "❌ API 할당량 초과",
      es: "❌ Cuota de API superada",
      "pt-BR": "❌ Cota de API excedida",
      fr: "❌ Quota API dépassé",
    },
    ui_err_key: {
      en: "❌ Invalid API Key",
      "zh-TW": "❌ API Key 無效",
      "zh-CN": "❌ API Key 无效",
      ja: "❌ APIキーが無効です",
      ko: "❌ API 키가 유효하지 않습니다",
      es: "❌ Clave API no válida",
      "pt-BR": "❌ Chave API inválida",
      fr: "❌ Clé API invalide",
    },
    ui_err_unknown: {
      en: "❌ Error: {0}",
      "zh-TW": "❌ 錯誤：{0}",
      "zh-CN": "❌ 错误：{0}",
      ja: "❌ エラー：{0}",
      ko: "❌ 오류: {0}",
      es: "❌ Error: {0}",
      "pt-BR": "❌ Erro: {0}",
      fr: "❌ Erreur : {0}",
    },

    api_h_invalid: {
      en: "Invalid API Key",
      "zh-TW": "API Key 無效",
      "zh-CN": "API Key 无效",
      ja: "APIキーが無効です",
      ko: "API 키가 유효하지 않습니다",
      es: "Clave API no válida",
      "pt-BR": "Chave API inválida",
      fr: "Clé API invalide",
    },
    api_h_manage: {
      en: "Manage API Key",
      "zh-TW": "管理 API Key",
      "zh-CN": "管理 API Key",
      ja: "APIキーの管理",
      ko: "API 키 관리",
      es: "Gestionar clave API",
      "pt-BR": "Gerenciar chave API",
      fr: "Gérer la clé API",
    },
    api_desc_enter: {
      en: "Please enter a valid YouTube Data API v3 Key",
      "zh-TW": "請輸入有效的 YouTube Data API v3 Key",
      "zh-CN": "请输入有效的 YouTube Data API v3 Key",
      ja: "有効なYouTube Data API v3キーを入力してください",
      ko: "유효한 YouTube Data API v3 키를 입력해 주세요",
      es: "Por favor ingrese una clave de API de YouTube Data v3 válida",
      "pt-BR": "Por favor, insira uma chave de API do YouTube Data v3 válida",
      fr: "Veuillez entrer une clé API YouTube Data v3 valide",
    },
    api_ph: {
      en: "Enter API Key",
      "zh-TW": "輸入 API Key",
      "zh-CN": "输入 API Key",
      ja: "APIキーを入力",
      ko: "API 키 입력",
      es: "Ingresar clave API",
      "pt-BR": "Inserir chave API",
      fr: "Entrer la clé API",
    },
    api_btn_confirm: {
      en: "Confirm",
      "zh-TW": "確認",
      "zh-CN": "确认",
      ja: "確認",
      ko: "확인",
      es: "Confirmar",
      "pt-BR": "Confirmar",
      fr: "Confirmer",
    },
    api_btn_delete: {
      en: "Delete Key",
      "zh-TW": "刪除 API Key",
      "zh-CN": "删除 API Key",
      ja: "キーを削除",
      ko: "키 삭제",
      es: "Eliminar clave",
      "pt-BR": "Excluir chave",
      fr: "Supprimer la clé",
    },
    api_link_check: {
      en: "Check Quota / Get Key",
      "zh-TW": "檢查配額或生成新 Key",
      "zh-CN": "检查配额或生成新 Key",
      ja: "クォータ確認 / キー取得",
      ko: "할당량 확인 / 키 발급",
      es: "Verificar cuota / Obtener clave",
      "pt-BR": "Verificar cota / Obter chave",
      fr: "Vérifier le quota / Obtenir une clé",
    },

    btn_add_key: {
      en: "Add API Key",
      "zh-TW": "新增 API Key",
      "zh-CN": "添加 API Key",
      ja: "APIキーを追加",
      ko: "API 키 추가",
      es: "Agregar clave API",
      "pt-BR": "Adicionar chave API",
      fr: "Ajouter une clé API",
    },
    msg_api_deleted_reenter: {
      en: "API Key deleted, please re-enter.",
      "zh-TW": "API Key 已刪除，請重新輸入",
      "zh-CN": "API Key 已删除，请重新输入",
      ja: "APIキーが削除されました。再入力してください。",
      ko: "API 키가 삭제되었습니다. 다시 입력해 주세요.",
      es: "Clave API eliminada, por favor, vuelva a ingresarla.",
      "pt-BR": "Chave API excluída, por favor, insira novamente.",
      fr: "Clé API supprimée, veuillez la saisir à nouveau.",
    },

    lang_picker_title: {
      en: "Select Interface Language",
      "zh-TW": "選擇介面語言",
      "zh-CN": "选择界面语言",
      ja: "インターフェース言語を選択",
      ko: "인터페이스 언어 선택",
      es: "Seleccionar idioma de interfaz",
      "pt-BR": "Selecionar idioma da interface",
      fr: "Sélectionner la langue de l'interface",
    },
    lang_picker_confirm: {
      en: "✅ Language switched to: {0}",
      "zh-TW": "✅ 語言已切換為：{0}",
      "zh-CN": "✅ 语言已切换为：{0}",
      ja: "✅ 言語が切り替わりました：{0}",
      ko: "✅ 언어가 변경되었습니다: {0}",
      es: "✅ Idioma cambiado a: {0}",
      "pt-BR": "✅ Idioma alterado para: {0}",
      fr: "✅ Langue changée en : {0}",
    },
    lang_picker_reload: {
      en: "Reloading page to apply...",
      "zh-TW": "正在重新載入頁面...",
      "zh-CN": "正在重新加载页面...",
      ja: "ページを再読み込みしています...",
      ko: "페이지를 다시 불러오는 중...",
      es: "Recargando página para aplicar...",
      "pt-BR": "Recarregando página para aplicar...",
      fr: "Rechargement de la page en cours...",
    },
    toggle_aria_label: {
      en: "YouTube Link Scanner",
      "zh-TW": "YouTube 掃描開關",
      "zh-CN": "YouTube 扫描开关",
      ja: "YouTubeリンクスキャナー",
      ko: "YouTube 링크 스캐너",
      es: "Escáner de enlaces YouTube",
      "pt-BR": "Scanner de links YouTube",
      fr: "Scanneur de liens YouTube",
    },
  };

  const SUPPORTED_LANGS = ["en", "zh-TW", "zh-CN", "ja", "ko", "es", "pt-BR", "fr"];
  let currentLang = SUPPORTED_LANGS.includes(GM_getValue("ytScriptLang", "en"))
    ? GM_getValue("ytScriptLang", "en")
    : "en";

  function txt(key, ...args) {
    let str = LANG_DICT[key]?.[currentLang] ?? LANG_DICT[key]?.["en"] ?? key;
    args.forEach((arg, i) => {
      str = str.replace(`{${i}}`, arg);
    });
    return str;
  }

  const LANG_OPTIONS = [
    { code: "en",    label: "English",        native: "English" },
    { code: "zh-TW", label: "繁體中文",       native: "繁體中文" },
    { code: "zh-CN", label: "简体中文",       native: "简体中文" },
    { code: "ja",    label: "日本語",         native: "日本語" },
    { code: "ko",    label: "한국어",         native: "한국어" },
    { code: "es",    label: "Español",        native: "Español" },
    { code: "pt-BR", label: "Português (BR)", native: "Português (BR)" },
    { code: "fr",    label: "Français",       native: "Français" },
  ];

  function showLangPicker() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed !important; top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.85);
      z-index: 2147483647 !important;
      display: flex; justify-content: center; align-items: center;
    `;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    const box = document.createElement("div");
    box.style.cssText = `
      background: #1a1a1a; border-radius: 10px;
      padding: 24px 28px; min-width: 280px;
      color: white; font-family: sans-serif;
      box-shadow: 0 0 30px rgba(0,0,0,0.8);
    `;

    const title = document.createElement("div");
    title.textContent = txt("lang_picker_title");
    title.style.cssText = `
      font-size: 17px; font-weight: bold;
      margin-bottom: 18px; text-align: center;
      color: #fff; letter-spacing: 0.3px;
    `;
    box.appendChild(title);

    const statusDiv = document.createElement("div");
    statusDiv.style.cssText = `
      font-size: 13px; text-align: center;
      min-height: 20px; margin-bottom: 14px;
      color: #4caf50;
    `;
    box.appendChild(statusDiv);

    LANG_OPTIONS.forEach(({ code, native }) => {
      const btn = document.createElement("button");
      const isActive = code === currentLang;
      btn.textContent = native + (isActive ? "  ✓" : "");
      btn.style.cssText = `
        display: block; width: 100%;
        padding: 10px 14px; margin-bottom: 8px;
        background: ${isActive ? "#2a5a2a" : "#2b2b2b"};
        color: ${isActive ? "#7fff7f" : "#e0e0e0"};
        border: 1px solid ${isActive ? "#4caf50" : "#444"};
        border-radius: 6px; font-size: 15px;
        cursor: ${isActive ? "default" : "pointer"};
        text-align: left; transition: background 0.15s;
        letter-spacing: 0.3px;
      `;
      if (!isActive) {
        btn.onmouseover = () => { btn.style.background = "#3a3a3a"; };
        btn.onmouseout  = () => { btn.style.background = "#2b2b2b"; };
        btn.onclick = () => {
          box.querySelectorAll("button").forEach(b => b.disabled = true);

          GM_setValue("ytScriptLang", code);
          currentLang = code;

          const verified = GM_getValue("ytScriptLang", null);
          const langName = LANG_OPTIONS.find(l => l.code === code)?.native || code;

          if (verified === code) {
            statusDiv.textContent = txt("lang_picker_confirm", langName);
            statusDiv.style.color = "#4caf50";
          } else {
            statusDiv.textContent = "⚠️ Save verification failed. Reloading anyway.";
            statusDiv.style.color = "#ff9800";
          }

          setTimeout(() => {
            statusDiv.textContent = txt("lang_picker_reload");
            statusDiv.style.color = "#90caf9";
            setTimeout(() => {
              overlay.remove();
              location.reload();
            }, 600);
          }, 900);
        };
      }
      box.appendChild(btn);
    });

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function preconnectToYouTube() {
    const domains = [
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
      "https://i.ytimg.com",
    ];
    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }
  preconnectToYouTube();

  let API_KEY = GM_getValue(
    "ytApiKey",
    localStorage.getItem("ylp_ytApiKey") || "我的API-KEY",
  );
  let useNoCookieMode = GM_getValue("ytNoCookieMode", false);
  let isProcessingEnabled = false;
  let isPermanentEnabled = GM_getValue("ytPermanentEnabled", false);
  let isSleeping = false;
  let sleepTimer = null;
  let hourCloseTimer = null;
  const SLEEP_HOURS = Math.max(0.5, parseFloat(GM_getValue("ytSleepHours", 3)));
  const SLEEP_MS = SLEEP_HOURS * 60 * 60 * 1000;
  let autoCloseTimer = null;
  let currentAbortController = null;
  const DEBUG = GM_getValue("ytDebugMode", false);
  function log(...args) {
    if (DEBUG) console.log(...args);
  }
  const COMMENT_API = "https://www.googleapis.com/youtube/v3/commentThreads";
  function _sz(maxPx, maxVwRatio) {
    const w = Math.min(maxPx, Math.floor(window.innerWidth  * maxVwRatio));
    const h = Math.min(Math.round(w * 9 / 16), Math.floor(window.innerHeight * 0.88));
    return { width: w, height: h };
  }
  const SIZE_OPTIONS = [
    { width: () => _sz(854,  0.82).width, height: () => _sz(854,  0.82).height },
    { width: () => _sz(1280, 0.82).width, height: () => _sz(1280, 0.82).height },
    { width: () => _sz(1920, 0.88).width, height: () => _sz(1920, 0.88).height },
    { width: "fit", height: "fit" },
    { width: () => _sz(99999, 0.95).width, height: () => _sz(99999, 0.95).height },
  ];
  let currentSizeIndex = parseInt(GM_getValue("ytPlayerSizeIndex", 1));

  let originalBodyOverflow = "";

  GM_registerMenuCommand(txt("menu_lang"), showLangPicker);

  GM_registerMenuCommand(txt("menu_refresh"), () => {
    console.log("Manual trigger YouTube link rescan");
    document.querySelectorAll("a[data-yt-preview-ready]").forEach((link) => {
      link.removeAttribute("data-yt-preview-ready");
    });
    removeYTButtons();
    processYTLinks();
    alert(txt("msg_refresh_done"));
  });

  GM_registerMenuCommand(txt("menu_add_api"), () => showApiKeyPrompt());

  GM_registerMenuCommand(txt("menu_del_api"), () => {
    GM_setValue("ytApiKey", "我的API-KEY");
    localStorage.setItem("ylp_ytApiKey", "我的API-KEY");
    API_KEY = "我的API-KEY";
    GM_setValue("ytNoCookieMode", false);
    useNoCookieMode = false;
    localStorage.setItem("ylp_ytNoCookieMode", "false");
    alert(txt("msg_api_deleted"));
  });

  GM_registerMenuCommand(txt("menu_btn_size"), () => {
    const size = prompt(
      txt("msg_btn_size_prompt"),
      GM_getValue("ytButtonSize", 18),
    );
    if (size && !isNaN(size)) {
      GM_setValue("ytButtonSize", parseInt(size));
      alert(txt("msg_btn_size_set", size));
    }
  });

  GM_registerMenuCommand(txt("menu_sleep_duration") + ` (${SLEEP_HOURS}h)`, () => {
    const val = prompt(txt("msg_sleep_prompt"), SLEEP_HOURS);
    if (val === null) return;
    const h = parseFloat(val);
    if (!isNaN(h) && h >= 0.5) {
      GM_setValue("ytSleepHours", h);
      alert(txt("msg_sleep_set", h));
    }
  });

  GM_registerMenuCommand(DEBUG ? txt("menu_debug") + " (ON)" : txt("menu_debug") + " (OFF)", () => {
    const newDebug = !DEBUG;
    GM_setValue("ytDebugMode", newDebug);
    alert(newDebug ? txt("msg_debug_on") : txt("msg_debug_off"));
  });

  GM_registerMenuCommand(
    isPermanentEnabled ? txt("menu_permanent") + " (ON)" : txt("menu_permanent") + " (OFF)",
    () => {
      isPermanentEnabled = !isPermanentEnabled;
      GM_setValue("ytPermanentEnabled", isPermanentEnabled);
      if (isPermanentEnabled) {
        isProcessingEnabled = true;
        GM_setValue("ytProcessingEnabled", true);
        processYTLinks();
        alert(txt("msg_perm_on"));
      } else {
        alert(txt("msg_perm_off"));
      }
    },
  );

  function startAutoCloseTimer() {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    console.log("⏱️ Auto-close timer started (10s)");
    autoCloseTimer = setTimeout(() => {
      console.log("🛑 Auto-closing YouTube scan");
      autoCloseYTScanning();
    }, 10000);
  }

  function stopAutoCloseTimer() {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
      console.log("⏹️ Auto-close timer stopped");
    }
  }

  function startSleepTimer() {
    if (sleepTimer) clearTimeout(sleepTimer);
    sleepTimer = setTimeout(() => {
      if (!isPermanentEnabled) return;
      enterSleep();
    }, SLEEP_MS);
    log(`💤 Sleep timer started (${SLEEP_HOURS}h)`);
  }

  function stopSleepTimer() {
    if (sleepTimer) { clearTimeout(sleepTimer); sleepTimer = null; }
  }

  function enterSleep() {
    if (!isPermanentEnabled || isSleeping) return;
    isSleeping = true;
    isProcessingEnabled = false;
    stopObserver();
    stopSleepTimer();
    console.log(`💤 YouTube scan entered sleep after ${SLEEP_HOURS}h`);

    const toggleBtn = document.querySelector(`[aria-label="${TOGGLE_ARIA_LABEL}"]`);
    if (toggleBtn) {
      const svg = toggleBtn.querySelector("#yt-toggle-svg");
      if (svg) {
        svg.style.filter = "drop-shadow(0 0 5px rgba(255,140,0,0.8)) brightness(1.1)";
        svg.style.color  = "rgba(255,160,40,1)";
      }
      toggleBtn.style.opacity = "0.75";
      toggleBtn.title = "💤 " + txt("lp_sleeping_label");
      const _zb = document.getElementById("yt-zzz-badge");
      if (_zb) {
        const _r = toggleBtn.getBoundingClientRect();
        _zb.style.left = `${_r.right - 10}px`;
        _zb.style.top  = `${_r.bottom - 14}px`;
        _zb.style.display = "block";
      }
    }
  }

  function exitSleep() {
    if (!isSleeping) return;
    isSleeping = false;
    isProcessingEnabled = true;
    setTimeout(() => processYTLinks(), 50);
    setTimeout(() => processYTLinks(), 750);

    const _zz = document.getElementById("yt-zzz-badge");
    if (_zz) _zz.style.display = "none";

    const _site = Object.keys(siteConfigs).find(s => window.location.hostname.includes(s));
    if (_site) {
      const t = document.querySelector(siteConfigs[_site].observerTarget);
      startObserver(t || document.body, t ? siteConfigs[_site].observerOptions : { childList: true, subtree: true });
    } else {
      startObserver(document.body, { childList: true, subtree: true });
    }

    startSleepTimer();
    console.log("☀️ YouTube scan woke up from sleep");

    const toggleBtn = document.querySelector(`[aria-label="${TOGGLE_ARIA_LABEL}"]`);
    if (toggleBtn) {
      const svg = toggleBtn.querySelector("#yt-toggle-svg");
      if (svg) {
        svg.style.filter = [
          "drop-shadow(0 0 4px rgba(255,210,0,0.95))",
          "drop-shadow(0 0 9px rgba(255,180,0,0.7))",
          "brightness(1.4)",
        ].join(" ");
        svg.style.color = "rgba(255,220,60,1)";
      }
      toggleBtn.style.opacity = "1";
      toggleBtn.title = txt("toggle_title_perm");
    }
  }

  function startHourCloseTimer(applyBtnStyleFn) {
    stopHourCloseTimer();
    hourCloseTimer = setTimeout(() => {
      if (!isPermanentEnabled) return;
      isPermanentEnabled = false; isProcessingEnabled = false; isSleeping = false;
      GM_setValue("ytPermanentEnabled", false);
      GM_setValue("ytProcessingEnabled", false);
      stopSleepTimer();
      stopObserver();
      removeYTButtons();
      if (applyBtnStyleFn) applyBtnStyleFn();
      console.log("⏰ 1h close timer fired — permanent scan stopped");
    }, 60 * 60 * 1000);
    log("⏰ 1h close timer started");
  }

  function stopHourCloseTimer() {
    if (hourCloseTimer) { clearTimeout(hourCloseTimer); hourCloseTimer = null; }
  }

  function autoCloseYTScanning() {
    if (isPermanentEnabled) {
      console.log("⚠️ autoClose skipped — permanent mode is active");
      return;
    }
    isProcessingEnabled = false;
    GM_setValue("ytProcessingEnabled", false);
    stopObserver();
    removeYTButtons();

    const toggleBtn = document.querySelector(`[aria-label="${TOGGLE_ARIA_LABEL}"]`);
    if (toggleBtn) {
      toggleBtn.title = updateTitleAndCountdownText(0, false);
      toggleBtn.style.opacity = "0.6";
      toggleBtn.style.boxShadow = "none";
      toggleBtn.style.filter = "none";
    }
    console.log("✅ YouTube scan auto-closed");
  }

  function extractYouTubeVideoId(url) {
    let decodedUrl = url;
    if (
      url.includes("discord.com/redirect?url=") ||
      url.includes("gamer.com.tw/redirect?url=")
    ) {
      try {
        const params = new URLSearchParams(url.split("?")[1]);
        decodedUrl = decodeURIComponent(params.get("url") || "");
      } catch (e) {
        return null;
      }
    }
    if (url.includes("duckduckgo.com/l/")) {
      try {
        const params = new URLSearchParams(url.split("?")[1]);
        const ddgTarget = params.get("uddg") || params.get("u3") || params.get("u");
        if (ddgTarget) decodedUrl = decodeURIComponent(ddgTarget);
      } catch (e) {
        return null;
      }
    }
    if (
      decodedUrl.includes("/channel/") ||
      decodedUrl.includes("/user/") ||
      decodedUrl.includes("/@") ||
      decodedUrl.includes("/playlist") ||
      decodedUrl.includes("/c/")
    ) {
      return null;
    }
    const pattern =
      /(?:[?&]v=|youtu\.be\/|shorts\/|embed\/|live\/|watch\?v=)([a-zA-Z0-9_-]{11})/;
    const match = decodedUrl.match(pattern);
    return match ? match[1] : null;
  }

  function _extractVideoIdFromFiber(el) {
    try {
      const fiberKey = Object.keys(el).find(
        k => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$")
      );
      if (!fiberKey) return null;
      let node = el[fiberKey];
      for (let depth = 0; depth < 40 && node; depth++) {
        const props = node.memoizedProps ?? node.pendingProps;
        if (props && typeof props === "object") {
          for (const val of Object.values(props)) {
            if (typeof val === "string" &&
                (val.includes("youtube") || val.includes("youtu.be"))) {
              const id = extractYouTubeVideoId(val);
              if (id) return id;
            }
            if (val && typeof val === "object" && !Array.isArray(val)) {
              for (const v2 of Object.values(val)) {
                if (typeof v2 === "string" &&
                    (v2.includes("youtube") || v2.includes("youtu.be"))) {
                  const id = extractYouTubeVideoId(v2);
                  if (id) return id;
                }
              }
            }
          }
        }
        node = node.return;
      }
    } catch (_) {  }
    return null;
  }

  function processVideoCards() {
    if (!isProcessingEnabled) return;
    const h   = window.location.hostname;
    const isDDG  = h.includes("duckduckgo.com");
    const isBing = h.includes("bing.com") &&
                   window.location.pathname.startsWith("/videos");
    if (!isDDG && !isBing) return;

    const buttonSize = GM_getValue("ytButtonSize", 18);

      const cardSel = isDDG
        ? "article:not([data-yt-card-ready])"
        : ".dg_u:not([data-yt-card-ready]), .mc_vtvc_meta:not([data-yt-card-ready]), .ivt_cp:not([data-yt-card-ready]), .mc_vtvc:not([data-yt-card-ready])";

     document.querySelectorAll(cardSel).forEach(card => {
          if (isBing && !card.hasAttribute("mmeta") && !card.querySelector("[ourl]")) return;

          let videoId = null;
          let chkUrl = "";

          const pA = card.closest("a[href]");
          if (pA) {
            chkUrl = pA.href;
            videoId = extractYouTubeVideoId(pA.href);
          }

          if (!videoId) {
            card.querySelectorAll("a[href]").forEach(a => {
              if (!chkUrl) chkUrl = a.href;
              if (!videoId) videoId = extractYouTubeVideoId(a.href);
            });
          }

          if (!videoId && isDDG) videoId = _extractVideoIdFromFiber(card);

          if (isBing) {
            const ourlEl = card.querySelector("[ourl]");
            if (ourlEl) {
              const ourl = ourlEl.getAttribute("ourl");
              if (ourl) chkUrl = ourl;
              if (!videoId) videoId = extractYouTubeVideoId(ourl);
            }
            if (!videoId && card.hasAttribute("mmeta")) {
              try {
                const mmeta = JSON.parse(card.getAttribute("mmeta"));
                if (mmeta.murl) {
                  chkUrl = mmeta.murl;
                  if (!videoId) videoId = extractYouTubeVideoId(mmeta.murl);
                }
              } catch(e) {}
            }
          }

          if (chkUrl && chkUrl.includes("duckduckgo.com/l/")) {
            try {
              chkUrl = decodeURIComponent(new URLSearchParams(chkUrl.split("?")[1]).get("uddg") || chkUrl);
            } catch(e) {}
          }

          let isUnsupported = false;
          if (videoId) {
            if (chkUrl && !chkUrl.includes("youtu.be") && !chkUrl.includes("youtube.com")) {
              isUnsupported = true;
            }
          } else {
            isUnsupported = true;
          }

          if (!videoId && !chkUrl) return;

          card.setAttribute("data-yt-card-ready", "true");
          if (pA) pA.setAttribute("data-yt-preview-ready", "true");
          card.querySelectorAll("a").forEach(a => a.setAttribute("data-yt-preview-ready", "true"));

      let insertTarget = null;
      let insertMethod = "append";

      const img = card.querySelector("img");
      if (img && img.parentElement) {
        insertTarget = img.parentElement;
        if (window.getComputedStyle(insertTarget).position === "static") {
          insertTarget.style.position = "relative";
        }
      } else {
        insertTarget = card;
      }
      if (!insertTarget) return;

          const cardBtnSize = Math.min(buttonSize, 16);
          const wrapper = document.createElement("div");
          wrapper.setAttribute("data-yt-btn", "true");
          wrapper.style.cssText = [
            "position:absolute", "top:6px", "right:6px", "left:auto", "bottom:auto",
            "width:fit-content", "height:fit-content",
            "z-index:2147483647",
            "background:rgba(0,0,0,0.75)", "padding:4px 6px",
            "border-radius:6px",
            "display:inline-flex", "align-items:center", "gap:6px",
            "pointer-events:auto", "line-height:1"
          ].join(";");

      const playBtn = document.createElement("span");
      playBtn.textContent = "▶️";
      playBtn.title       = isUnsupported ? "Non-YouTube Video" : txt("btn_play_tooltip");
      playBtn.setAttribute("data-yt-btn", "true");
      playBtn.style.cssText = [
        `cursor:${isUnsupported ? "not-allowed" : "pointer"}`,
        `opacity:${isUnsupported ? "0.25" : "0.7"}`,
        isUnsupported ? "filter:grayscale(100%)" : "",
        "display:inline-block !important",
        `font-size:${cardBtnSize}px !important`,
        "vertical-align:middle !important",
        "direction:ltr !important", "transform:none !important",
        "unicode-bidi:normal !important",
      ].join(";");

      let _lpT;
      const _titleOf = () =>
        card.querySelector("h2,[role='heading']")?.textContent?.trim() ?? "";

      if (isUnsupported) {
        playBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); };
      } else {
        playBtn.onmousedown = e => {
          e.preventDefault(); e.stopPropagation();
          _lpT = setTimeout(() => {
            useNoCookieMode = !useNoCookieMode;
            GM_setValue("ytNoCookieMode", useNoCookieMode);
            localStorage.setItem("ylp_ytNoCookieMode", String(useNoCookieMode));
            createPlayer(videoId, _titleOf());
          }, 700);
        };
        playBtn.onclick = e => {
          e.preventDefault(); e.stopPropagation();
          clearTimeout(_lpT);
          createPlayer(videoId, _titleOf());
        };
        playBtn.onmouseup    = () => clearTimeout(_lpT);
        playBtn.onmouseleave = () => clearTimeout(_lpT);
        playBtn.addEventListener("touchstart", e => {
          e.preventDefault(); e.stopPropagation();
          _lpT = setTimeout(() => {
            _lpT = null;
            useNoCookieMode = !useNoCookieMode;
            GM_setValue("ytNoCookieMode", useNoCookieMode);
            localStorage.setItem("ylp_ytNoCookieMode", String(useNoCookieMode));
            createPlayer(videoId, _titleOf());
          }, 700);
        }, { passive: false });
        playBtn.addEventListener("touchend", () => {
          if (_lpT) { clearTimeout(_lpT); _lpT = null; createPlayer(videoId, _titleOf()); }
        }, { passive: true });
        playBtn.addEventListener("touchcancel", () => {
          clearTimeout(_lpT); _lpT = null;
        }, { passive: true });
      }

      const commentBtn = document.createElement("span");
      commentBtn.textContent = "💬";
      commentBtn.title       = isUnsupported ? "Non-YouTube Video" : txt("btn_comment_tooltip");
      commentBtn.setAttribute("data-yt-btn", "true");
      commentBtn.style.cssText = [
        `cursor:${isUnsupported ? "not-allowed" : "pointer"}`,
        `opacity:${isUnsupported ? "0.25" : "0.7"}`,
        isUnsupported ? "filter:grayscale(100%)" : "",
        "display:inline-block !important",
        `font-size:${cardBtnSize}px !important`,
        "vertical-align:middle !important",
        "direction:ltr !important", "transform:none !important",
        "unicode-bidi:normal !important",
      ].join(";");

      if (isUnsupported) {
        commentBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); };
      } else {
        commentBtn.onclick = e => {
          e.preventDefault(); e.stopPropagation();
          showComments(videoId);
        };
        commentBtn.addEventListener("touchstart", e => {
          e.preventDefault(); e.stopPropagation();
        }, { passive: false });
        commentBtn.addEventListener("touchend", e => {
          e.stopPropagation(); showComments(videoId);
        }, { passive: true });
      }

      wrapper.appendChild(playBtn);
      wrapper.appendChild(commentBtn);

      try {
        if (insertMethod === "before") {
          insertTarget.parentNode?.insertBefore(wrapper, insertTarget);
        } else {
          insertTarget.appendChild(wrapper);
        }
        log(`🎬 Card btn injected: ${videoId} (${isDDG ? "DDG" : "Bing"})`);
      } catch (e) {
        console.error("processVideoCards inject error:", e);
      }
    });
  }

  function focusOnPlayerAndPauseOthers() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    document.querySelectorAll("video, audio").forEach((media) => {
      if (
        !media.closest("#yt-preview-popup") &&
        !media.closest("#floatingPlayer") &&
        !media.paused
      ) {
        try {
          media.pause();
          console.log("Paused background media");
        } catch (e) {}
      }
    });
  }

  function createPlayer(videoId, titleText) {
    const oldPopup = document.getElementById("yt-preview-popup");
    if (oldPopup) {
      oldPopup.remove();
    } else if (!document.body.dataset.ytOverflowLocked) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.dataset.ytOverflowLocked = "1";
      document.body.style.overflow = "hidden";
    }

    focusOnPlayerAndPauseOthers();

    const overlay = document.createElement("div");
    overlay.id = "yt-preview-popup";
    overlay.setAttribute("tabindex", "-1");
    overlay.style.cssText = `
            position:fixed !important;
            top:0; left:0; width:100vw; height:100vh;
            background:rgba(0,0,0,0.7); 
            z-index:2147483647 !important;
            display:flex; justify-content:center; align-items:center;
            pointer-events:auto;
            outline: none; 
            will-change: opacity;
        `;

    overlay.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (e.target === overlay) {
        _closeOverlay();
      }
    };

    overlay.onkeydown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        _closeOverlay();
      } else if (
        e.key === " " ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.stopPropagation();
      }
    };

    const container = document.createElement("div");
    container.style.cssText = `
            position:relative;
            background:#000; border-radius:4px;
            overflow:visible; display:flex; justify-content:center; align-items:center;
            z-index:2147483647 !important; box-shadow: 0 0 30px rgba(0,0,0,0.8);
            transform: translateZ(0);
            will-change: transform;
        `;
    const playerDiv = document.createElement("div");
    playerDiv.style.cssText =
      "width:100%; height:100%; overflow:hidden; border-radius:4px; transform: translateZ(0);";

    const embedDomain = useNoCookieMode
      ? "www.youtube-nocookie.com"
      : "www.youtube.com";
    playerDiv.innerHTML = `
            <iframe width="100%" height="100%"
                src="https://${embedDomain}/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="eager"
                tabindex="0"
                style="display:block; width:100%; height:100%;"></iframe>
        `;

    const centerBtnMask = document.createElement("div");
    centerBtnMask.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        width:68px; height:68px;
        background:rgba(0,0,0,0);
        border-radius:50%;
        pointer-events:none;
        z-index:5;
        transition: background 0.25s;
    `;
    const applyMaskIfMobile = () => {
      try {
        const iframeEl = playerDiv.querySelector("iframe");
        if (!iframeEl) return;
        void iframeEl.contentDocument;
      } catch (_) {
        centerBtnMask.style.background = "rgba(0,0,0,0.85)";
      }
    };
    setTimeout(applyMaskIfMobile, 800);
    playerDiv.style.position = "relative";
    playerDiv.appendChild(centerBtnMask);

    const resizeBtn = document.createElement("div");
    resizeBtn.innerText = "⛶";
    resizeBtn.title = txt("player_resize");
    resizeBtn.style.cssText = `
            position:absolute; top:-26px; left:50%; transform:translateX(-50%);
            height:22px; padding:0 10px;
            background:rgba(0,0,0,0.55); color:white; font-size:13px;
            text-align:center; line-height:22px; border-radius:4px 4px 0 0;
            cursor:pointer; opacity:0.7; transition:opacity 0.2s;
            z-index:2147483647 !important; pointer-events:auto;
            white-space:nowrap; user-select:none;
        `;
    resizeBtn.onclick = (e) => {
      e.stopPropagation();
      currentSizeIndex = (currentSizeIndex + 1) % SIZE_OPTIONS.length;
      GM_setValue("ytPlayerSizeIndex", currentSizeIndex);
      applySize(container);
    };

    let noCookieTag = null;
    if (useNoCookieMode) {
      noCookieTag = document.createElement("div");
      noCookieTag.innerText = "No-Cookie";
      noCookieTag.title = txt("player_nocookie_hint") ||
        "No-Cookie mode is active. If playback fails, long-press ▶️ to switch back to standard mode.";
      noCookieTag.style.cssText = `
        position:absolute; top:4px;
        height:22px; padding:0 7px;
        background:rgba(30,30,30,0.6); color:rgba(255,255,255,0.45);
        font-size:11px; line-height:22px; border-radius:4px 4px 0 0;
        white-space:nowrap; user-select:none; pointer-events:auto;
        z-index:2147483647 !important; cursor:default;
        transition: color 0.2s, background 0.2s;
      `;
      noCookieTag.onmouseenter = () => {
        noCookieTag.style.color   = "rgba(255,200,80,0.9)";
        noCookieTag.style.background = "rgba(50,40,10,0.75)";
      };
      noCookieTag.onmouseleave = () => {
        noCookieTag.style.color   = "rgba(255,255,255,0.45)";
        noCookieTag.style.background = "rgba(30,30,30,0.6)";
      };
    }

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `position:relative; display:inline-block; padding-top:30px;`;
    wrapper.onclick = (e) => {
      if (e.target === wrapper) {
        _closeOverlay();
      }
    };

    resizeBtn.style.top    = "4px";
    resizeBtn.style.left   = "50%";
    resizeBtn.style.transform = "translateX(-50%)";

    container.appendChild(playerDiv);
    wrapper.appendChild(resizeBtn);
    if (noCookieTag) wrapper.appendChild(noCookieTag);
    wrapper.appendChild(container);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
    _bringFloatingPlayerToFront();

    const _onOrientResize = () => applySize(container);
    window.addEventListener('resize', _onOrientResize);

    const _closeOverlay = () => {
      overlay.remove();
      window.removeEventListener('resize', _onOrientResize);
      try { screen.orientation?.unlock?.(); } catch (_) {}
      document.body.style.overflow = originalBodyOverflow;
      delete document.body.dataset.ytOverflowLocked;
    };

    new MutationObserver((_, obs) => {
      if (document.body.contains(overlay)) return;
      window.removeEventListener('resize', _onOrientResize);
      try { screen.orientation?.unlock?.(); } catch (_) {}
      obs.disconnect();
    }).observe(document.body, { childList: true });

    if ('orientation' in screen &&
        typeof screen.orientation.lock === 'function' &&
        window.innerWidth < window.innerHeight) {
      screen.orientation.lock('landscape').catch(() => {});
    }

    if (noCookieTag) {
      requestAnimationFrame(() => {
        const rRect = resizeBtn.getBoundingClientRect();
        const wRect = wrapper.getBoundingClientRect();
        const tagW = noCookieTag.offsetWidth || 80;
        noCookieTag.style.left = `${rRect.left - wRect.left - tagW - 4}px`;
      });
    }

    overlay.focus();

    const iframe = playerDiv.querySelector("iframe");
    if (iframe) {
      setTimeout(() => {
        iframe.focus();
        focusOnPlayerAndPauseOthers();
      }, 50);
      setTimeout(() => {
        if (document.activeElement !== iframe) {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          iframe.focus();
        }
      }, 350);
    }

    (function attachYTEmbedFix(iframe) {
      if (!iframe || iframe.dataset.ytFixAttached) return;
      iframe.dataset.ytFixAttached = "1";

      let lastReload = 0;
      let blankCount = 0;
      let reloadCount = 0;
      const MAX_RELOAD = 5;

      const reloadIframe = () => {
        if (++reloadCount > MAX_RELOAD) {
          clearInterval(monitorId);
          console.warn("[YT FIX] max reload limit reached, giving up");
          return;
        }
        const now = performance.now();
        if (now - lastReload < 3000) return;
        lastReload = now;

        if (iframe.dataset.ytMonitorId) {
          clearInterval(parseInt(iframe.dataset.ytMonitorId));
          delete iframe.dataset.ytMonitorId;
        }

        const url = new URL(iframe.src);
        url.searchParams.set("_reload", Date.now());

        const newIframe = iframe.cloneNode();
        newIframe.src = url.toString();
        iframe.replaceWith(newIframe);

        attachYTEmbedFix(newIframe);
        console.warn("[YT FIX] iframe reloaded");
      };

      const monitorId = setInterval(() => {
        if (!document.body.contains(iframe)) {
          clearInterval(monitorId);
          delete iframe.dataset.ytMonitorId;
          return;
        }

        try {
          const rect = iframe.getBoundingClientRect();

          if (rect.width < 50 || rect.height < 50) {
            blankCount++;
          } else {
            blankCount = 0;
          }

          if (blankCount >= 3) reloadIframe();
        } catch {}
      }, 1500);

      iframe.dataset.ytMonitorId = monitorId.toString();
    })(iframe);

    const hoverRegion = document.createElement("div");
    hoverRegion.style.cssText = `
            position:absolute; top:0; left:0;
            width:100%; height:100%;
            pointer-events:none; z-index:1;
        `;
    container.appendChild(hoverRegion);

    let titleTimer;
    container.addEventListener("mouseenter", () => {
      clearTimeout(titleTimer);
      resizeBtn.style.opacity = "1";
    });
    container.addEventListener("mouseleave", () => {
      titleTimer = setTimeout(() => {
        resizeBtn.style.opacity = "0.7";
      }, 800);
    });
    applySize(container);
  }

  function applySize(container) {
    const opt = SIZE_OPTIONS[currentSizeIndex];
    const width = typeof opt.width === "function" ? opt.width() : opt.width;
    const height = typeof opt.height === "function" ? opt.height() : opt.height;
    if (width === "fit") {
      container.style.width = "90vw";
      container.style.height = "calc(90vw * 9 / 16)";
    } else {
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
    }
  }

  function showApiKeyPrompt(videoId = null, errorMessage = "") {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position:fixed !important; top:0; left:0; width:100vw; height:100vh;
            background:rgba(0,0,0,0.9); z-index:2147483647 !important;
            display:flex; justify-content:center; align-items:center;
        `;
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    const box = document.createElement("div");
    box.style.cssText = `
            width:400px; background:#111; color:white; padding:16px;
            border-radius:8px; text-align:center; user-select: text;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
        `;

    box.innerHTML = `
            <h3>${errorMessage ? txt("api_h_invalid") : txt("api_h_manage")}</h3>
            <p>${errorMessage ? txt("api_desc_enter") : txt("api_desc_enter")}</p>
            ${errorMessage ? `<p style="color:#f66;">${txt("ui_err_unknown", errorMessage)}</p>` : ""}
            <input type="text" id="apiKeyInput" placeholder="${txt("api_ph")}" style="width:100%; padding:8px; margin:8px 0;" value="${API_KEY !== "我的API-KEY" ? API_KEY : ""}">
            <div style="display:flex; justify-content:space-around;">
                <button id="submitApiKey">${txt("api_btn_confirm")}</button>
                <button id="deleteApiKey">${txt("api_btn_delete")}</button>
            </div>
            <div style="margin-top:12px;">
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color:#0f9d58;">${txt("api_link_check")}</a>
            </div>
        `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById("submitApiKey").onclick = () => {
      const input = document.getElementById("apiKeyInput").value.trim();

      if (!input) {
        alert(txt("api_desc_enter"));
        return;
      }

      if (input.length < 30) {
        alert(txt("msg_api_invalid_fmt"));
        return;
      }

      if (!/^[A-Za-z0-9_-]+$/.test(input)) {
        alert(txt("msg_api_invalid_fmt"));
        return;
      }

      const loadingMsg = document.createElement("div");
      loadingMsg.textContent = txt("msg_api_validating");
      loadingMsg.style.cssText = "color: yellow; margin-top: 8px;";
      box.appendChild(loadingMsg);

      testApiKey(input, (isValid) => {
        loadingMsg.remove();

        if (isValid) {
          API_KEY = input;
          GM_setValue("ytApiKey", input);
          localStorage.setItem("ylp_ytApiKey", input);
          useNoCookieMode = false;
          GM_setValue("ytNoCookieMode", false);
          localStorage.setItem("ylp_ytNoCookieMode", "false");
          overlay.remove();
          if (videoId) showComments(videoId);
          alert(txt("msg_api_success"));
        } else {
          alert(txt("msg_api_fail"));
        }
      });
    };

    document.getElementById("deleteApiKey").onclick = () => {
      GM_setValue("ytApiKey", "我的API-KEY");
      localStorage.setItem("ylp_ytApiKey", "我的API-KEY");
      API_KEY = "我的API-KEY";
      useNoCookieMode = false;
      GM_setValue("ytNoCookieMode", false);
      localStorage.setItem("ylp_ytNoCookieMode", "false");
      overlay.remove();
      if (videoId) {
        showApiKeyPrompt(videoId, txt("msg_api_deleted_reenter"));
      } else {
        alert(txt("msg_api_deleted"));
      }
    };
  }

  const TOGGLE_ARIA_LABEL = txt("toggle_aria_label");

  const siteConfigs = {
    "discord.com": {
      selector:
        'div:has(> [aria-label="收件匣"]), div:has(> [aria-label="Inbox"])',
      insertMethod: "insertBefore",
      insertTarget: '[aria-label="收件匣"], [aria-label="Inbox"]',
      delay: 2000,
      buttonStyles: {
        marginRight: "8px",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#dbdee1",
        cursor: "pointer",
      },
      observerTarget: '[data-list-id="chat-messages"]',
      observerOptions: { childList: true, subtree: true },
    },
    "google.": {

      selector: "#gb",
      insertMethod: "insertBefore",
      insertTarget:
        '#gbwa, a[aria-label="Google apps"], div[aria-label="Google 應用程式"]',
      delay: 1000,
      buttonStyles: {
        marginRight: "4px",
        marginLeft: "8px",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#5f6368",
        cursor: "pointer",
        borderRadius: "50%",
        transition: "background 0.2s",
        marginTop: "auto",
        marginBottom: "auto",
      },
      observerTarget: "body",
      observerOptions: { childList: true, subtree: true },
    },
  };

  function testApiKey(key, callback) {
    const testUrl = `${COMMENT_API}?part=snippet&videoId=dQw4w9WgXcQ&maxResults=1&key=${key}`;

    GM_xmlhttpRequest({
      method: "GET",
      url: testUrl,
      timeout: 5000,
      onload: (res) => {
        try {
          const json = JSON.parse(res.responseText);
          callback(!json.error);
        } catch (e) {
          callback(false);
        }
      },
      onerror: () => callback(false),
      ontimeout: () => callback(false),
    });
  }

  function updateTitleAndCountdownText(remainingTime, showCountdown) {
        const featureDesc = txt("toggle_desc");

        if (isProcessingEnabled && showCountdown && !isPermanentEnabled) {
          const status = txt("toggle_title_auto_close", remainingTime);
          return `${txt("toggle_title_detecting")} (${status})\n${featureDesc}\n----------------\n👉 ${txt("toggle_instr_lock")}`;
        } else if (isProcessingEnabled) {
          return `${txt("toggle_title_perm")}\n${featureDesc}\n----------------\n👉 ${txt("toggle_instr_close")}`;
        } else {
          return `${txt("toggle_title_off")}\n${featureDesc}\n----------------\n👇 ${txt("toggle_instr_click")}\n${txt("toggle_instr_hold")}`;
        }
  }

  function insertToggleButton(configKey = "discord.com") {
    const config = siteConfigs[configKey];
    if (!config) return;

    function tryInsertButton() {
      const container = document.querySelector(config.selector);
      if (!container) return false;

      if (document.querySelector(`[aria-label="${TOGGLE_ARIA_LABEL}"]`))
        return true;

      const toggleBtn = document.createElement("div");
      toggleBtn.className = "yt-toggle-safe";
      toggleBtn.setAttribute("data-yt-toggle", "true");
      toggleBtn.setAttribute("role", "button");
      toggleBtn.setAttribute("aria-label", TOGGLE_ARIA_LABEL);
      toggleBtn.setAttribute("tabindex", "0");

      let styles = `
                display: inline-flex;
                align-items: center; justify-content: center;
                cursor: pointer; flex-shrink: 0;
            `;
      for (const [key, value] of Object.entries(config.buttonStyles)) {
        styles += `${key}: ${value};`;
      }
      toggleBtn.style.cssText = styles;

      toggleBtn.innerHTML = `
                <svg id="yt-toggle-svg" x="0" y="0" aria-hidden="true" role="img"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     fill="none" viewBox="0 0 24 24"
                     style="transition:filter 0.25s ease,opacity 0.2s ease;display:block;">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
            `;

      if (!document.getElementById("yt-ui-style")) {
        const _s = document.createElement("style");
        _s.id = "yt-ui-style";
        _s.textContent = `
          @keyframes yt-badge-pop {
            0%   { opacity:0; transform:scale(0.55) }
            70%  { transform:scale(1.12) }
            100% { opacity:1; transform:scale(1) }
          }
          @keyframes yt-menu-drop {
            from { opacity:0; transform:translateX(-50%) translateY(-10px) }
            to   { opacity:1; transform:translateX(-50%) translateY(0) }
          }
          @keyframes yt-zzz-float {
            0%   { opacity:0;    transform:translate(0,0)    scale(0.7) }
            20%  { opacity:0.85; }
            80%  { opacity:0.6;  }
            100% { opacity:0;    transform:translate(6px,-12px) scale(1.1) }
          }
          #yt-scan-badge { animation: yt-badge-pop 0.22s cubic-bezier(.34,1.56,.64,1) both }
          #yt-lp-menu    { animation: yt-menu-drop 0.18s ease both }
          #yt-lp-menu .yt-mi { transition: background 0.1s }
          #yt-lp-menu .yt-mi:hover  { background: rgba(255,255,255,0.09) !important }
          #yt-lp-menu .yt-mi:active { background: rgba(255,255,255,0.16) !important }
          #yt-zzz-badge .yt-z {
            position:absolute; font-size:9px; font-weight:800; color:#ffb347;
            font-family:system-ui,-apple-system,sans-serif;
            animation: yt-zzz-float 2s ease-in-out infinite;
            text-shadow: 0 0 4px rgba(255,140,0,0.7);
            line-height:1; pointer-events:none;
          }
          #yt-zzz-badge .yt-z:nth-child(1) { left:2px;  bottom:2px;  animation-delay:0s;    font-size:7px  }
          #yt-zzz-badge .yt-z:nth-child(2) { left:7px;  bottom:5px;  animation-delay:0.65s; font-size:9px  }
          #yt-zzz-badge .yt-z:nth-child(3) { left:13px; bottom:8px;  animation-delay:1.3s;  font-size:11px }
        `;
        document.head.appendChild(_s);
      }

      const BADGE_R    = 10;
      const BADGE_CIRC = parseFloat((2 * Math.PI * BADGE_R).toFixed(2));

      const badge = document.createElement("div");
      badge.id = "yt-scan-badge";
      badge.style.cssText = [
        "display:none", "position:fixed", "z-index:2147483647",
        "pointer-events:none", "user-select:none",
      ].join(";");
      badge.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 28 28"
             style="display:block;filter:drop-shadow(0 2px 7px rgba(0,0,0,0.55))">
          <!-- 背景圓 -->
          <circle cx="14" cy="14" r="${BADGE_R}"
                  fill="rgba(18,18,18,0.82)" stroke="rgba(255,255,255,0.14)" stroke-width="1.2"/>
          <!-- 進度弧 -->
          <circle id="yt-badge-arc" cx="14" cy="14" r="${BADGE_R}" fill="none"
                  stroke="#ff4545" stroke-width="2.6" stroke-linecap="round"
                  stroke-dasharray="${BADGE_CIRC}" stroke-dashoffset="0"
                  transform="rotate(-90 14 14)"
                  style="transition:stroke-dashoffset 0.88s linear"/>
          <!-- 數字 -->
          <text id="yt-badge-num" x="14" y="18.4" text-anchor="middle"
                font-size="9.5" font-weight="700" fill="white"
                font-family="system-ui,-apple-system,sans-serif">10</text>
        </svg>`;
      document.body.appendChild(badge);

      const zzzBadge = document.createElement("div");
      zzzBadge.id = "yt-zzz-badge";
      zzzBadge.style.cssText = [
        "display:none", "position:fixed", "z-index:2147483647",
        "pointer-events:none", "user-select:none",
        "width:26px", "height:26px",
      ].join(";");
      zzzBadge.innerHTML = `<span class="yt-z">z</span><span class="yt-z">z</span><span class="yt-z">Z</span>`;
      document.body.appendChild(zzzBadge);

      function _posZzz() {
        const r = toggleBtn.getBoundingClientRect();
        zzzBadge.style.left = `${r.right - 10}px`;
        zzzBadge.style.top  = `${r.bottom - 14}px`;
      }
      function showZzz() { _posZzz(); zzzBadge.style.display = "block"; }
      function hideZzz() { zzzBadge.style.display = "none"; }

      function _posBadge() {
        const r = toggleBtn.getBoundingClientRect();
        badge.style.left = `${r.right - 13}px`;
        badge.style.top  = `${r.top  - 13}px`;
      }
      function showBadge(n) {
        _posBadge();
        const arc = document.getElementById("yt-badge-arc");
        const num = document.getElementById("yt-badge-num");
        if (arc) { arc.style.transition = "none"; arc.style.strokeDashoffset = "0"; }
        if (num) num.textContent = n;
        badge.style.display = "block";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (arc) arc.style.transition = "stroke-dashoffset 0.88s linear";
        }));
      }
      function tickBadge(remaining) {
        const offset = BADGE_CIRC * (1 - remaining / 10);
        const arc = document.getElementById("yt-badge-arc");
        const num = document.getElementById("yt-badge-num");
        if (arc) arc.style.strokeDashoffset = offset;
        if (num) num.textContent = remaining;
        if (arc) arc.style.stroke = remaining <= 3 ? "#ff9800" : "#ff4545";
      }
      function hideBadge() { badge.style.display = "none"; }

      let remainingTime = 10;
      let timeInterval  = null;

      const updateTitle = () =>
        updateTitleAndCountdownText(
          remainingTime,
          isProcessingEnabled && !!autoCloseTimer && !isPermanentEnabled,
        );

      function applyBtnStyle() {
        toggleBtn.title         = updateTitle();
        toggleBtn.style.opacity = (isProcessingEnabled || isSleeping) ? (isSleeping ? "0.75" : "1") : "0.6";
        const svg = toggleBtn.querySelector("#yt-toggle-svg");
        if (svg) {
          if (isSleeping) {
            svg.style.filter = "drop-shadow(0 0 5px rgba(255,140,0,0.8)) brightness(1.1)";
            svg.style.color  = "rgba(255,160,40,1)";
            showZzz();
          } else if (isPermanentEnabled) {
            hideZzz();
            svg.style.filter = [
              "drop-shadow(0 0 4px rgba(255,210,0,0.95))",
              "drop-shadow(0 0 9px rgba(255,180,0,0.7))",
              "brightness(1.4)",
            ].join(" ");
            svg.style.color = "rgba(255,220,60,1)";
          } else if (isProcessingEnabled) {
            hideZzz();
            svg.style.filter = "drop-shadow(0 0 3px rgba(100,200,255,0.6))";
            svg.style.color  = "";
          } else {
            hideZzz();
            svg.style.filter = "none";
            svg.style.color  = "";
          }
        }
      }

      function startCountdown() {
        stopCountdown();
        remainingTime = 10;
        showBadge(10);
        startAutoCloseTimer();
        timeInterval = setInterval(() => {
          remainingTime--;
          tickBadge(remainingTime);
          toggleBtn.title = updateTitle();
          if (remainingTime <= 0) {
            clearInterval(timeInterval); timeInterval = null;
            hideBadge();
          }
        }, 1000);
      }

      function stopCountdown() {
        stopAutoCloseTimer();
        if (timeInterval) { clearInterval(timeInterval); timeInterval = null; }
        hideBadge();
        remainingTime = 10;
      }

      function showLongPressMenu() {
        const existing = document.getElementById("yt-lp-menu");
        if (existing) { existing.remove(); return; }

        const rect = toggleBtn.getBoundingClientRect();
        const menu = document.createElement("div");
        menu.id = "yt-lp-menu";

        const MENU_EST_H = 150;
        const topBelow   = rect.bottom + 10;
        const topAbove   = rect.top - MENU_EST_H - 10;
        const topPos     = topBelow + MENU_EST_H < window.innerHeight
          ? topBelow : Math.max(6, topAbove);

        menu.style.cssText = [
          "position:fixed", `z-index:2147483647`,
          `top:${topPos}px`,
          `left:${rect.left + rect.width / 2}px`,
          "transform:translateX(-50%)",
          "background:rgba(16,16,16,0.95)",
          "backdrop-filter:blur(18px)", "-webkit-backdrop-filter:blur(18px)",
          "border:1px solid rgba(255,255,255,0.11)",
          "border-radius:14px", "padding:6px 5px 7px",
          "box-shadow:0 14px 44px rgba(0,0,0,0.65),0 1px 0 rgba(255,255,255,0.06) inset",
          "min-width:210px",
          "font-family:system-ui,-apple-system,sans-serif",
          "user-select:none",
        ].join(";");

        const header = document.createElement("div");
        header.style.cssText = [
          "color:rgba(255,255,255,0.38)", "font-size:10px", "font-weight:700",
          "letter-spacing:0.8px", "padding:4px 12px 7px", "text-transform:uppercase",
        ].join(";");
        header.textContent = txt("lp_menu_title");
        menu.appendChild(header);

        const hr = document.createElement("div");
        hr.style.cssText = "height:1px;background:rgba(255,255,255,0.08);margin:0 4px 5px;";
        menu.appendChild(hr);

        const items = [];

        if (isSleeping) {
          items.push({
            icon: "💤", dot: "#ff9800",
            label: txt("lp_sleeping_label"),
            desc:  txt("lp_sleeping_desc", SLEEP_HOURS),
            action() {},
          });
          items.push({
            icon: "☀️", dot: "#69c76f",
            label: txt("lp_wake_label"),
            desc:  txt("lp_wake_desc"),
            action() { exitSleep(); applyBtnStyle(); },
          });
          items.push({
            icon: "⏹", dot: "#ef9a9a",
            label: txt("lp_stop_label"),
            desc:  txt("lp_stop_desc"),
            action() {
              isPermanentEnabled = false; isSleeping = false;
              GM_setValue("ytPermanentEnabled", false);
              stopSleepTimer(); stopObserver(); removeYTButtons();
              applyBtnStyle();
            },
          });
        } else if (!isProcessingEnabled) {
          items.push({
            icon: "⏱", dot: "#69c76f",
            label: txt("lp_scan_10s_label"),
            desc:  txt("lp_scan_10s_desc"),
            action() {
              isProcessingEnabled = true;
              GM_setValue("ytProcessingEnabled", true);
              setTimeout(() => processYTLinks(), 50);
              setTimeout(() => processYTLinks(), 750);
              const t = document.querySelector(config.observerTarget);
              if (t) startObserver(t, config.observerOptions);
              startCountdown();
              applyBtnStyle();
              log(`10s scan started (${configKey})`);
            },
          });
          items.push({
            icon: "🔒", dot: "#ffd54f",
            label: txt("lp_perm_label"),
            desc:  txt("lp_perm_desc"),
            action() {
              isPermanentEnabled = true; isProcessingEnabled = true; isSleeping = false;
              GM_setValue("ytPermanentEnabled", true);
              GM_setValue("ytProcessingEnabled", true);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer();
              processYTLinks();
              const t = document.querySelector(config.observerTarget);
              if (t) startObserver(t, config.observerOptions);
              startSleepTimer();
              applyBtnStyle();
              log(`Always-on locked (${configKey})`);
            },
          });
          items.push({
            icon: "⏰", dot: "#80cbc4",
            label: txt("lp_1h_label"),
            desc:  txt("lp_1h_desc"),
            action() {
              isPermanentEnabled = true; isProcessingEnabled = true; isSleeping = false;
              GM_setValue("ytPermanentEnabled", true);
              GM_setValue("ytProcessingEnabled", true);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer();
              processYTLinks();
              const t = document.querySelector(config.observerTarget);
              if (t) startObserver(t, config.observerOptions);
              startSleepTimer();
              startHourCloseTimer(applyBtnStyle);
              applyBtnStyle();
              log(`1h auto-close permanent scan started (${configKey})`);
            },
          });
        } else if (isPermanentEnabled) {
          items.push({
            icon: "⏱", dot: "#555", disabled: true,
            label: txt("lp_disabled_10s"),
            desc:  "",
            action() {},
          });
          items.push({
            icon: "⏰", dot: "#80cbc4",
            label: txt("lp_1h_label"),
            desc:  txt("lp_1h_desc"),
            action() {
              stopHourCloseTimer();
              startHourCloseTimer(applyBtnStyle);
              applyBtnStyle();
            },
          });
          items.push({
            icon: "🔓", dot: "#80cbc4",
            label: txt("lp_unperm_label"),
            desc:  txt("lp_unperm_desc"),
            action() {
              isPermanentEnabled = false; isSleeping = false;
              GM_setValue("ytPermanentEnabled", false);
              stopSleepTimer(); stopHourCloseTimer();
              startCountdown();
              applyBtnStyle();
            },
          });
          items.push({
            icon: "⏹", dot: "#ef9a9a",
            label: txt("lp_stop_label"),
            desc:  txt("lp_stop_desc"),
            action() {
              isProcessingEnabled = false; isPermanentEnabled = false; isSleeping = false;
              GM_setValue("ytProcessingEnabled", false);
              GM_setValue("ytPermanentEnabled", false);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer(); stopObserver(); removeYTButtons();
              applyBtnStyle();
            },
          });
        } else {
          items.push({
            icon: "🔒", dot: "#ffd54f",
            label: txt("lp_lock_label"),
            desc:  txt("lp_lock_desc"),
            action() {
              isPermanentEnabled = true; isSleeping = false;
              GM_setValue("ytPermanentEnabled", true);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer();
              startSleepTimer();
              applyBtnStyle();
            },
          });
          items.push({
            icon: "⏰", dot: "#80cbc4",
            label: txt("lp_1h_label"),
            desc:  txt("lp_1h_desc"),
            action() {
              isPermanentEnabled = true; isSleeping = false;
              GM_setValue("ytPermanentEnabled", true);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer();
              startSleepTimer();
              startHourCloseTimer(applyBtnStyle);
              applyBtnStyle();
            },
          });
          items.push({
            icon: "⏹", dot: "#ef9a9a",
            label: txt("lp_close_label"),
            desc:  txt("lp_close_desc"),
            action() {
              isProcessingEnabled = false; isPermanentEnabled = false; isSleeping = false;
              GM_setValue("ytProcessingEnabled", false);
              GM_setValue("ytPermanentEnabled", false);
              stopCountdown(); stopSleepTimer(); stopHourCloseTimer(); stopObserver(); removeYTButtons();
              applyBtnStyle();
            },
          });
        }

        items.forEach(({ icon, dot, label, desc, action, disabled }) => {
          const item = document.createElement("div");
          item.className = "yt-mi";
          item.style.cssText = [
            "display:flex", "align-items:center", "gap:10px",
            "padding:8px 11px", "border-radius:9px",
            disabled ? "cursor:not-allowed;opacity:0.38" : "cursor:pointer",
          ].join(";");
          item.innerHTML = `
            <span style="font-size:16px;width:22px;text-align:center;flex-shrink:0;line-height:1">${icon}</span>
            <span style="flex:1;min-width:0">
              <span style="display:block;color:${disabled ? "rgba(255,255,255,0.4)" : "#f0f0f0"};font-size:13.5px;font-weight:500;line-height:1.3">${label}</span>
              ${desc ? `<span style="display:block;color:rgba(255,255,255,0.35);font-size:10.5px;margin-top:1px">${desc}</span>` : ""}
            </span>
            <span style="width:6px;height:6px;border-radius:50%;background:${dot};flex-shrink:0;${disabled ? "" : `box-shadow:0 0 5px ${dot}88`}"></span>`;
          if (!disabled) {
            item.onclick = (ev) => {
              ev.stopPropagation();
              menu.remove();
              document.removeEventListener("pointerdown", _dismissMenu, true);
              action();
            };
          }
          menu.appendChild(item);
        });

        document.body.appendChild(menu);

        function _dismissMenu(ev) {
          if (!menu.contains(ev.target)) {
            menu.remove();
            document.removeEventListener("pointerdown", _dismissMenu, true);
          }
        }
        setTimeout(() =>
          document.addEventListener("pointerdown", _dismissMenu, true), 10);
      }

      applyBtnStyle();

      let lpTimer = null;
      let longPressTriggered = false;

      toggleBtn.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        longPressTriggered = false;
        lpTimer = setTimeout(() => {
          longPressTriggered = true;
          lpTimer = null;
          showLongPressMenu();
        }, 500);
      };

      toggleBtn.onmouseup = () => {
        if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
      };
      toggleBtn.onmouseleave = () => {
        if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
      };

      toggleBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        if (longPressTriggered) { longPressTriggered = false; return; }

        if (isPermanentEnabled || isSleeping) return;

        if (isProcessingEnabled) {
          isProcessingEnabled = false; isPermanentEnabled = false; isSleeping = false;
          GM_setValue("ytProcessingEnabled", false);
          GM_setValue("ytPermanentEnabled", false);
          stopCountdown(); stopSleepTimer(); stopHourCloseTimer(); stopObserver(); removeYTButtons();
        } else {
          isProcessingEnabled = true;
          GM_setValue("ytProcessingEnabled", true);
          setTimeout(() => processYTLinks(), 50);
          setTimeout(() => processYTLinks(), 750);
          const target = document.querySelector(config.observerTarget);
          if (target) startObserver(target, config.observerOptions);
          startCountdown();
        }
        applyBtnStyle();
      };

      if (config.insertMethod === "insertBefore") {
        const targetElement = container.querySelector(config.insertTarget);
        if (targetElement) {
          targetElement.parentNode.insertBefore(toggleBtn, targetElement);
        } else {
          container.appendChild(toggleBtn);
        }
      } else {
        container.appendChild(toggleBtn);
      }

      const buttonObserver = new MutationObserver(() => {
        if (!document.body.contains(toggleBtn)) {
          tryInsertButton();
        }
      });
      buttonObserver.observe(container, { childList: true, subtree: true });

      return true;
    }

    setTimeout(() => {
      if (tryInsertButton()) return;
      const insertObserver = new MutationObserver(
        () => tryInsertButton() && insertObserver.disconnect(),
      );
      insertObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => insertObserver.disconnect(), 15000);
    }, config.delay);
  }

  function removeYTButtons() {
    document
      .querySelectorAll('[data-yt-btn="true"]')
      .forEach((btn) => btn.remove());
    document
      .querySelectorAll("a[data-yt-preview-ready]")
      .forEach((link) => link.removeAttribute("data-yt-preview-ready"));
    document
      .querySelectorAll("[data-yt-card-ready]")
      .forEach((card) => card.removeAttribute("data-yt-card-ready"));
  }

  let processTimeout;
  let _pendingMutations = [];
  let _needFullScan = false;
  let _toggleInterval = null;

  function processYTLinks(mutations = []) {
    if (!isProcessingEnabled) return;

    if (mutations.length === 0) {
      _needFullScan = true;
    } else {
      if (_pendingMutations.length < 200) {
        _pendingMutations.push(...mutations);
      } else {
        _needFullScan = true;
        _pendingMutations.length = 0;
      }
    }

    clearTimeout(processTimeout);
    processTimeout = setTimeout(() => {
      const snapshot    = _pendingMutations.splice(0);
      const doFullScan  = _needFullScan;
      _needFullScan     = false;

      let links = [];
      if (!doFullScan && snapshot.length > 0) {
        snapshot.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                links.push(
                  ...Array.from(
                    node.querySelectorAll(
                      'a[href*="youtu"]:not([data-yt-preview-ready]), a[href*="gamer.com.tw/redirect?url=*ytu*"]:not([data-yt-preview-ready]), a[href*="discord.com/redirect?url=*ytu*"]:not([data-yt-preview-ready])',
                    ),
                  ),
                );
                if (node.tagName === "A" && !node.dataset.ytPreviewReady &&
                    (node.href.includes("youtu") ||
                     node.href.includes("gamer.com.tw/redirect") ||
                     node.href.includes("discord.com/redirect"))) {
                  links.push(node);
                }
              }
            });
          }
        });
      } else {
        links = Array.from(
          document.querySelectorAll(
            'a[href*="youtu"]:not([data-yt-preview-ready]), a[href*="gamer.com.tw/redirect?url=*ytu*"]:not([data-yt-preview-ready]), a[href*="discord.com/redirect?url=*ytu*"]:not([data-yt-preview-ready])',
          ),
        );
      }

      const _batchInserted = new Set();

      links.forEach((link) => {
        if (
          link.closest("#yt-preview-popup") ||
          link.closest("#floatingPlayer")
        )
          return;

        const videoId = extractYouTubeVideoId(link.href);
        if (!videoId) return;

        if (_batchInserted.has(videoId)) {
          link.setAttribute("data-yt-preview-ready", "true");
          return;
        }

        const buttonSize = GM_getValue("ytButtonSize", 18);
        const isGoogle = window.location.hostname.includes("google.");
        const isDDG = window.location.hostname.includes("duckduckgo.com");
        const isBing = window.location.hostname.includes("bing.com");

        if ((isDDG && (link.closest("article") || link.querySelector("article"))) ||
            (isBing && link.closest(".dg_u, .mc_vtvc_meta, .ivt_cp, .mc_vtvc"))) {
          link.setAttribute("data-yt-preview-ready", "true");
          return;
        }

        if (isGoogle) {
          if (link.closest("cite")) return;
          if (!link.querySelector("h3, [role='heading']") &&
              !link.closest("h3, [role='heading']")) {
            const linkText = link.textContent.trim();
            if (!linkText || linkText.startsWith("http") ||
                linkText.includes("youtube.com") || linkText.includes("youtu.be")) {
              return;
            }
          }
        }

        const playBtn = document.createElement("span");
        playBtn.innerText = "▶️";
        playBtn.title = txt("btn_play_tooltip");
        playBtn.setAttribute("data-yt-btn", "true");
        playBtn.style.cssText = `
                    margin-left:4px; cursor:pointer; opacity:0.6; display:inline-block !important;
                    z-index:2147483647 !important; font-size: ${buttonSize}px !important; vertical-align: middle !important;
                    direction: ltr !important; transform: none !important; unicode-bidi: normal !important;
                `;
        let playLongPressTimer;
        playBtn.onmousedown = (e) => {
          e.preventDefault();
          e.stopPropagation();
          playLongPressTimer = setTimeout(() => {
            useNoCookieMode = !useNoCookieMode;
            GM_setValue("ytNoCookieMode", useNoCookieMode);
            localStorage.setItem("ylp_ytNoCookieMode", useNoCookieMode.toString());
            const titleText = link.textContent.trim() || link.title || "";
            createPlayer(videoId, titleText);
          }, 700);
        };
        playBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(playLongPressTimer);
          const titleText = link.textContent.trim() || link.title || "";
          createPlayer(videoId, titleText);
        };
        playBtn.onmouseup = () => clearTimeout(playLongPressTimer);
        playBtn.onmouseleave = () => clearTimeout(playLongPressTimer);

        playBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          playLongPressTimer = setTimeout(() => {
            playLongPressTimer = null;
            useNoCookieMode = !useNoCookieMode;
            GM_setValue("ytNoCookieMode", useNoCookieMode);
            localStorage.setItem("ylp_ytNoCookieMode", useNoCookieMode.toString());
            const titleText = link.textContent.trim() || link.title || "";
            createPlayer(videoId, titleText);
          }, 700);
        }, { passive: false });

        playBtn.addEventListener('touchend', () => {
          if (playLongPressTimer) {
            clearTimeout(playLongPressTimer);
            playLongPressTimer = null;
            const titleText = link.textContent.trim() || link.title || "";
            createPlayer(videoId, titleText);
          }
        }, { passive: true });

        playBtn.addEventListener('touchcancel', () => {
          clearTimeout(playLongPressTimer);
          playLongPressTimer = null;
        }, { passive: true });

        const commentBtn = document.createElement("span");
        commentBtn.innerText = "💬";
        commentBtn.title = txt("btn_comment_tooltip");
        commentBtn.setAttribute("data-yt-btn", "true");
        commentBtn.style.cssText = `
                    margin-left:4px; cursor:pointer; opacity:0.6; display:inline-block !important;
                    z-index:2147483647 !important; font-size: ${buttonSize}px !important; vertical-align: middle !important;
                    direction: ltr !important; transform: none !important; unicode-bidi: normal !important;
                `;
        commentBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          showComments(videoId);
        };

        commentBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { passive: false });

        commentBtn.addEventListener('touchend', (e) => {
          e.stopPropagation();
          showComments(videoId);
        }, { passive: true });

        try {
          if (isGoogle) {
            const btnWrapper = document.createElement("div");
            btnWrapper.setAttribute("data-yt-btn", "true");
            btnWrapper.style.cssText = `
              display: block;
              margin-top: 3px;
              margin-left: 0;
              line-height: 1;
              pointer-events: auto;
              direction: ltr !important;
              transform: none !important;
              unicode-bidi: normal !important;
            `;
            btnWrapper.appendChild(playBtn);
            btnWrapper.appendChild(commentBtn);

            const headingEl = link.querySelector("h3, [role='heading']") ||
                              link.closest("h3, [role='heading']");
            const insertAfter = headingEl ? headingEl.parentNode : link;
            insertAfter.insertAdjacentElement("afterend", btnWrapper);
          } else {
            link.insertAdjacentElement("afterend", commentBtn);
            link.insertAdjacentElement("afterend", playBtn);
          }
          link.setAttribute("data-yt-preview-ready", "true");
          _batchInserted.add(videoId);
        } catch (e) {
          console.error("Failed to insert buttons for link:", link.href, e);
        }
      });

      processVideoCards();
    }, 300);
  }

  function showComments(videoId) {
    focusOnPlayerAndPauseOthers();

    const overlay = document.createElement("div");
    overlay.style.cssText = `
          position:fixed; top:0; left:0; width:100vw; height:100vh;
          background:rgba(0,0,0,0.7);
          z-index:2147483647 !important;
          display:flex; justify-content:center; align-items:center;
          outline: none;
      `;
    overlay.onclick = (e) => {
      e.stopPropagation();
      if (e.target === overlay) overlay.remove();
    };

    const box = document.createElement("div");
    box.style.cssText = `
          width:680px; min-height:200px;
          max-height:90vh; background:#111;
          color:#fff; font-size:16px; padding:16px; overflow-y:auto;
          border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.5);
          user-select: text; cursor: default;
      `;
    box.onclick = (e) => e.stopPropagation();

    const topBar = document.createElement("div");
    topBar.style.cssText = `display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:nowrap; gap:8px;`;
    const controls = document.createElement("div");
    controls.style.cssText = `display:flex; align-items:center; gap:6px; font-size:13px; flex:1; min-width:0; user-select:none; flex-wrap:nowrap;`;
    controls.innerHTML = `
          <style>
              .common-control {
                  height: 26px;
                  font-size: 12px; padding: 1px 4px; line-height: 1.2;
                  border: 1px solid #555; border-radius: 4px; background-color: #222;
                  color: white; box-sizing: border-box;
              }
          </style>
          <label style="display:inline-flex;align-items:center;gap:3px;white-space:nowrap;">${txt("ui_sort")}
              <select id="orderSelect" class="common-control" style="pointer-events:auto;">
                  <option value="relevance">${txt("ui_sort_top")}</option>
                  <option value="time">${txt("ui_sort_new")}</option>
              </select>
          </label>
          <label style="display:inline-flex;align-items:center;gap:3px;white-space:nowrap;">${txt("ui_count")}
              <select id="countSelect" class="common-control" style="pointer-events:auto;">
                  <option value="100">100</option>
                  <option value="300">300</option>
                  <option value="500">500</option>
                  <option value="800">800</option>
              </select>
          </label>
          <label style="display:inline-flex;align-items:center;gap:3px;white-space:nowrap;">🌐
              <select id="langSelect" class="common-control" style="pointer-events:auto; max-width:100px;">
                  <option value="">${txt("ui_lang_ph")}</option>
                  <optgroup label="── East Asia ──">
                  <option value="zh-TW">${txt("ui_lang_zh")}</option>
                  <option value="zh-CN">${txt("ui_lang_cn")}</option>
                  <option value="ja">${txt("ui_lang_ja")}</option>
                  <option value="ko">${txt("ui_lang_ko")}</option>
                  <option value="mn">${txt("ui_lang_mn")}</option>
                  </optgroup>
                  <optgroup label="── Southeast Asia ──">
                  <option value="th">${txt("ui_lang_th")}</option>
                  <option value="vi">${txt("ui_lang_vi")}</option>
                  <option value="id">${txt("ui_lang_id")}</option>
                  <option value="ms">${txt("ui_lang_ms")}</option>
                  <option value="tl">${txt("ui_lang_tl")}</option>
                  <option value="km">${txt("ui_lang_km")}</option>
                  <option value="lo">${txt("ui_lang_lo")}</option>
                  <option value="my">${txt("ui_lang_my")}</option>
                  </optgroup>
                  <optgroup label="── South Asia ──">
                  <option value="hi">${txt("ui_lang_hi")}</option>
                  <option value="bn">${txt("ui_lang_bn")}</option>
                  <option value="ur">${txt("ui_lang_ur")}</option>
                  <option value="ne">${txt("ui_lang_ne")}</option>
                  <option value="si">${txt("ui_lang_si")}</option>
                  </optgroup>
                  <optgroup label="── Western Europe ──">
                  <option value="en">${txt("ui_lang_en")}</option>
                  <option value="fr">${txt("ui_lang_fr")}</option>
                  <option value="de">${txt("ui_lang_de")}</option>
                  <option value="es">${txt("ui_lang_es")}</option>
                  <option value="pt">${txt("ui_lang_pt")}</option>
                  <option value="it">${txt("ui_lang_it")}</option>
                  <option value="nl">${txt("ui_lang_nl")}</option>
                  <option value="ca">${txt("ui_lang_ca")}</option>
                  </optgroup>
                  <optgroup label="── Northern Europe ──">
                  <option value="sv">${txt("ui_lang_sv")}</option>
                  <option value="no">${txt("ui_lang_no")}</option>
                  <option value="da">${txt("ui_lang_da")}</option>
                  <option value="fi">${txt("ui_lang_fi")}</option>
                  <option value="is">${txt("ui_lang_is")}</option>
                  </optgroup>
                  <optgroup label="── Eastern Europe ──">
                  <option value="ru">${txt("ui_lang_ru")}</option>
                  <option value="uk">${txt("ui_lang_uk")}</option>
                  <option value="pl">${txt("ui_lang_pl")}</option>
                  <option value="cs">${txt("ui_lang_cs")}</option>
                  <option value="sk">${txt("ui_lang_sk")}</option>
                  <option value="hu">${txt("ui_lang_hu")}</option>
                  <option value="ro">${txt("ui_lang_ro")}</option>
                  <option value="bg">${txt("ui_lang_bg")}</option>
                  <option value="hr">${txt("ui_lang_hr")}</option>
                  <option value="sr">${txt("ui_lang_sr")}</option>
                  <option value="sl">${txt("ui_lang_sl")}</option>
                  <option value="lt">${txt("ui_lang_lt")}</option>
                  <option value="lv">${txt("ui_lang_lv")}</option>
                  <option value="et">${txt("ui_lang_et")}</option>
                  <option value="mk">${txt("ui_lang_mk")}</option>
                  <option value="sq">${txt("ui_lang_sq")}</option>
                  <option value="mt">${txt("ui_lang_mt")}</option>
                  </optgroup>
                  <optgroup label="── Southern Europe ──">
                  <option value="el">${txt("ui_lang_el")}</option>
                  </optgroup>
                  <optgroup label="── Middle East / West Asia ──">
                  <option value="ar">${txt("ui_lang_ar")}</option>
                  <option value="he">${txt("ui_lang_he")}</option>
                  <option value="fa">${txt("ui_lang_fa")}</option>
                  <option value="tr">${txt("ui_lang_tr")}</option>
                  <option value="az">${txt("ui_lang_az")}</option>
                  <option value="ka">${txt("ui_lang_ka")}</option>
                  <option value="hy">${txt("ui_lang_hy")}</option>
                  </optgroup>
                  <optgroup label="── Central Asia ──">
                  <option value="kk">${txt("ui_lang_kk")}</option>
                  <option value="uz">${txt("ui_lang_uz")}</option>
                  </optgroup>
                  <optgroup label="── Africa ──">
                  <option value="sw">${txt("ui_lang_sw")}</option>
                  <option value="af">${txt("ui_lang_af")}</option>
                  <option value="am">${txt("ui_lang_am")}</option>
                  <option value="yo">${txt("ui_lang_yo")}</option>
                  <option value="ig">${txt("ui_lang_ig")}</option>
                  <option value="ha">${txt("ui_lang_ha")}</option>
                  <option value="zu">${txt("ui_lang_zu")}</option>
                  </optgroup>
              </select>
          </label>
          <input id="searchInput" type="text" placeholder="${txt("ui_search_ph")}" class="common-control" style="width:80px; flex-shrink:1; min-width:40px; pointer-events: auto;" />
      `;
    const playBtn = document.createElement("button");
    playBtn.innerHTML = txt("ui_btn_float");
    playBtn.title = txt("btn_play_tooltip");
    playBtn.style.cssText = `font-size:13px; border:none; background:#3ea6ff; color:#000; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold; white-space:nowrap; pointer-events:auto;`;
    playBtn.onmouseenter = () => { playBtn.style.opacity = "0.85"; };
    playBtn.onmouseleave = () => { playBtn.style.opacity = "1"; };
    playBtn.onclick = (e) => {
      e.stopPropagation();
      showFloatingPlayer(videoId);
    };

    const apiKeyBtn = document.createElement("button");
    apiKeyBtn.innerHTML = txt("ui_btn_api");
    apiKeyBtn.style.cssText = `font-size:13px; border:none; background:#333; color:#fff; padding:4px 8px; border-radius:4px; cursor:pointer; white-space:nowrap; pointer-events:auto;`;
    apiKeyBtn.onmouseenter = () => { apiKeyBtn.style.background = "#444"; };
    apiKeyBtn.onmouseleave = () => { apiKeyBtn.style.background = "#333"; };
    apiKeyBtn.onclick = (e) => {
      e.stopPropagation();
      showApiKeyMenu();
    };

    const topBarRight = document.createElement("div");
    topBarRight.style.cssText = "display:flex; align-items:center; gap:6px; flex-shrink:0;";
    topBarRight.appendChild(playBtn);
    topBarRight.appendChild(apiKeyBtn);
    topBar.appendChild(controls);
    topBar.appendChild(topBarRight);

    const titleBar = document.createElement("div");
    titleBar.style.cssText =
      "display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;";

    const title = document.createElement("div");
    title.textContent = txt("ui_title_comments");
    title.style.cssText = `font-size:18px; font-weight:bold;`;
    titleBar.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✖";
    closeBtn.title = "Close (Esc)";
    closeBtn.style.cssText = `
    background: transparent; border: none;
    color: #aaa; font-size: 20px; cursor: pointer;
    padding: 0; width: 24px; height: 24px;
    pointer-events: auto; transition: color 0.2s;
  `;
    closeBtn.onmouseover = () => (closeBtn.style.color = "#fff");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#aaa");
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      overlay.remove();
    };
    titleBar.appendChild(closeBtn);

    overlay.onkeydown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (currentAbortController) {
          currentAbortController.abort();
          currentAbortController = null;
        }
        overlay.remove();
      }
    };
    overlay.setAttribute("tabindex", "-1");

    const pageControls = document.createElement("div");
    pageControls.style.cssText =
      "display:flex; justify-content:center; align-items:center; gap:6px;";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = txt("ui_btn_prev");
    prevBtn.disabled = true;
    prevBtn.style.cssText = `
          padding:2px 8px; border-radius:4px; border:none; cursor:pointer;
          background:#111;
          color:#fff; font-weight:bold; pointer-events: auto;
      `;

    const nextBtn = document.createElement("button");
    nextBtn.textContent = txt("ui_btn_next");
    nextBtn.disabled = true;
    nextBtn.style.cssText = `
          padding:2px 8px; border-radius:4px; border:none; cursor:pointer;
          background:#1e90ff;
          color:#fff; font-weight:bold; pointer-events: auto;
      `;

    pageControls.appendChild(prevBtn);
    pageControls.appendChild(nextBtn);
    titleBar.appendChild(pageControls);
    box.appendChild(topBar);
    box.appendChild(titleBar);

    const content = document.createElement("div");
    content.style = "margin-top:12px; user-select: text; cursor: text;";
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    _bringFloatingPlayerToFront();
    overlay.focus();

    function showApiKeyMenu() {
      const existingMenu = document.getElementById("apiKeyMenu");
      if (existingMenu) existingMenu.remove();

      const menu = document.createElement("div");
      menu.id = "apiKeyMenu";
      menu.style.cssText = `
              position:absolute; top:40px;
              right:8px; width:200px;
              background:#222; color:white; padding:8px;
              border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.5);
              z-index:2147483647 !important; user-select: none; pointer-events: auto;
          `;
      menu.innerHTML = `
              <button id="addApiKey" style="width:100%; padding:8px; margin-bottom:8px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">${txt("btn_add_key")}</button>
              <button id="deleteApiKey" style="width:100%; padding:8px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">${txt("api_btn_delete")}</button>
          `;
      box.appendChild(menu);

      document.getElementById("addApiKey").onclick = () => {
        menu.remove();
        showApiKeyPrompt(videoId);
      };

      document.getElementById("deleteApiKey").onclick = () => {
        GM_setValue("ytApiKey", "我的API-KEY");
        localStorage.setItem("ylp_ytApiKey", "我的API-KEY");
        API_KEY = "我的API-KEY";
        useNoCookieMode = false;
        GM_setValue("ytNoCookieMode", false);
        localStorage.setItem("ylp_ytNoCookieMode", "false");
        content.innerHTML = txt("msg_api_deleted_reenter");
        menu.remove();
        showApiKeyPrompt(videoId);
      };
      document.addEventListener(
        "click",
        (e) => {
          if (!menu.contains(e.target) && e.target !== apiKeyBtn) {
            menu.remove();
          }
        },
        { once: true },
      );
    }

    let allLoadedComments = [];
    let currentOrder = "relevance";
    let maxResults = 100;
    let currentPageToken = "";
    let nextPageToken = "";
    let prevPageTokens = [];

    document.getElementById("orderSelect").value = currentOrder;
    document.getElementById("countSelect").value = maxResults;
    document.getElementById("orderSelect").onchange = (e) => {
      currentOrder = e.target.value;
      resetPagination();
      loadComments();
    };
    document.getElementById("countSelect").onchange = (e) => {
      maxResults = parseInt(e.target.value);
      resetPagination();
      loadComments();
    };

  function getLangFreq() {
      try {
        return JSON.parse(GM_getValue("ytLangFreq", "{}"));
      } catch {
        return {};
      }
    }

  function recordLangUsage(langCode) {
      if (!langCode) return;
      const freq = getLangFreq();
      freq[langCode] = (freq[langCode] || 0) + 1;
      GM_setValue("ytLangFreq", JSON.stringify(freq));
    }

  function getTopLangs(n = 3) {
      const freq = getLangFreq();
      return Object.entries(freq)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([code]) => code);
    }

  const TOP_LANG_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

  function rebuildLangSelect(selectEl) {
      if (!selectEl) return;

      const top = getTopLangs(3);
      if (top.length === 0) return;

      const existing = selectEl.querySelector("optgroup[data-freq-top]");
      if (existing) existing.remove();

      const labelMap = {};
      selectEl.querySelectorAll("option[value]").forEach((opt) => {
        if (opt.value) labelMap[opt.value] = opt.textContent.trim();
      });

      const topGroup = document.createElement("optgroup");
      topGroup.label = "⭐ Frequent";
      topGroup.setAttribute("data-freq-top", "1");

      top.forEach((code, idx) => {
        if (!labelMap[code]) return;
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = labelMap[code];
        opt.style.color = TOP_LANG_COLORS[idx] || TOP_LANG_COLORS[2];
        opt.style.fontWeight = idx === 0 ? "700" : "500";
        topGroup.appendChild(opt);
      });

      const placeholder = selectEl.querySelector("option[value='']");
      if (placeholder && placeholder.nextSibling) {
        selectEl.insertBefore(topGroup, placeholder.nextSibling);
      } else {
        selectEl.prepend(topGroup);
      }
    }

    rebuildLangSelect(document.getElementById("langSelect"));

    document.getElementById("langSelect").onchange = (e) => {
      const lang = e.target.value;

      if (lang) {
        recordLangUsage(lang);
        rebuildLangSelect(e.target);
        e.target.value = lang;
      }

      content.querySelectorAll(".translated-text").forEach((el) => el.remove());

      if (lang) {
        translateAll(content, lang);
      } else {
        if (currentAbortController) {
          currentAbortController.abort();
          currentAbortController = null;
        }
      }
    };

    document.getElementById("searchInput").oninput = () => {
      filterComments(
        document.getElementById("searchInput").value.trim().toLowerCase(),
      );
    };
    prevBtn.onclick = () => {
      if (prevPageTokens.length) {
        const prevToken = prevPageTokens.pop();
        loadComments(prevToken, true);
      }
    };
    nextBtn.onclick = () => {
      if (nextPageToken) {
        prevPageTokens.push(currentPageToken);
        loadComments(nextPageToken);
      }
    };
    function resetPagination() {
      currentPageToken = "";
      nextPageToken = "";
      prevPageTokens = [];
    }

    function updatePageButtonState() {
      prevBtn.disabled = prevPageTokens.length === 0;
      nextBtn.disabled = !nextPageToken;
      prevBtn.style.opacity = prevBtn.disabled ? "0.6" : "1";
      nextBtn.style.opacity = nextBtn.disabled ? "0.6" : "1";
    }

    function loadComments(pageToken = "", isPrev = false, retryCount = 0) {
      if (API_KEY === "我的API-KEY") {
        content.innerHTML = txt("api_desc_enter");
        showApiKeyPrompt(videoId);
        return;
      }

      content.innerHTML = txt("ui_loading");
      currentPageToken = pageToken;
      fetchComments(
        videoId,
        currentOrder,
        maxResults,
        pageToken,
        (comments, error) => {
          content.innerHTML = "";
          if (error) {
            if (
              error.code === 403 &&
              error.message.includes("disabled comments")
            ) {
              content.innerHTML = txt("ui_err_disabled");
              return;
            }
            if (error.code === 403) {
              let errorMessage = error.message.includes("quota")
                ? txt("ui_err_quota")
                : error.message.includes("keyInvalid")
                  ? txt("ui_err_key")
                  : "Invalid API Key or Restricted";
              if (retryCount < 1) {
                setTimeout(
                  () => loadComments(pageToken, isPrev, retryCount + 1),
                  2000,
                );
                return;
              }
              GM_setValue("ytApiKey", "我的API-KEY");
              API_KEY = "我的API-KEY";
              content.innerHTML = `❌ ${errorMessage}`;
              showApiKeyPrompt(videoId, errorMessage);
              return;
            }
            content.textContent = txt("ui_err_unknown", error.message || "Unknown");
            return;
          }
          if (!comments.length) {
            content.innerHTML = txt("ui_no_comments");
            return;
          }
          allLoadedComments = comments;
          renderComments(comments);

          updatePageButtonState();
        },
      );
    }

    function renderComments(comments) {
      content.innerHTML = "";
      comments.forEach((c) => {
        const p = document.createElement("div");
        p.style.cssText = `border-bottom:1px solid #444; padding:8px 6px; margin-bottom:6px; user-select: text; cursor: text;`;
        p.innerHTML = `
                  <div style="color:#aaa; font-size:14px; margin-bottom:4px; user-select: text;">${cleanHTML(c.author)}</div>
                  <div class="comment-text" style="user-select: text; cursor: text;">${cleanHTML(c.text)}</div>
                  <div style="color:#0f9d58; font-size:14px; user-select: text;">👍 ${c.likeCount}</div>
              `;
        content.appendChild(p);
      });
    }

    function filterComments(keyword) {
      renderComments(
        keyword
          ? allLoadedComments.filter(
              (c) =>
                c.text.toLowerCase().includes(keyword) ||
                c.plain.toLowerCase().includes(keyword),
            )
          : allLoadedComments,
      );
    }

    function translateAll(container, lang) {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }

      currentAbortController = new AbortController();
      const signal = currentAbortController.signal;

      const validLangs = ["zh-TW", "zh-CN", "ja", "en", "fr", "ko"];
      if (!validLangs.includes(lang)) {
        content.innerHTML = "❌ Invalid Language Code";
        return;
      }

      const nodes = container.querySelectorAll(".comment-text");
      if (nodes.length === 0) {
        content.innerHTML = "No text to translate";
        return;
      }

      nodes.forEach(async (node) => {
        const text = node.textContent;
        if (!text.trim()) return;

        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
            { signal },
          );

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const json = await res.json();
          if (!json || !Array.isArray(json[0]))
            throw new Error("Invalid API Response");

          const translated = json[0].map((x) => x[0]).join("");
          if (translated === text)
            throw new Error("Result identical to source");

          if (signal.aborted) return;

          const translatedDiv = document.createElement("div");
          translatedDiv.textContent = translated;
          translatedDiv.style.cssText = `background:black; color:yellow; padding:4px; margin-top:2px; border-radius:4px; user-select: text; cursor: text;`;

          if (
            !node.nextSibling ||
            node.nextSibling.className !== "translated-text"
          ) {
            translatedDiv.className = "translated-text";
            node.parentNode.insertBefore(translatedDiv, node.nextSibling);
          }
        } catch (error) {
          if (error.name === "AbortError") return;

          console.error(`Trans Error: ${text.substring(0, 50)}...`, error);

          if (!signal.aborted) {
            const errorDiv = document.createElement("div");
            errorDiv.textContent = `Trans Fail: ${error.message}`;
            errorDiv.style.cssText = `color:red; background:#000; margin-top:4px; user-select: text; cursor: text;`;
            node.parentNode.insertBefore(errorDiv, node.nextSibling);
          }
        }
      });
    }

    function fetchComments(
      videoId,
      order,
      totalTarget,
      pageToken = "",
      callback,
    ) {
      let allComments = [];
      let localPageToken = pageToken;

      function fetchPage() {
        const url = `${COMMENT_API}?part=snippet&videoId=${videoId}&maxResults=${Math.min(totalTarget - allComments.length, 100)}&order=${order}&key=${API_KEY}${localPageToken ? `&pageToken=${localPageToken}` : ""}`;
        GM_xmlhttpRequest({
          method: "GET",
          url,
          onload: (res) => {
            try {
              const json = JSON.parse(res.responseText);
              if (json.error) {
                callback([], json.error);
                return;
              }
              const newComments =
                json.items?.map((item) => {
                  const s = item.snippet.topLevelComment.snippet;
                  return {
                    text: s.textDisplay,
                    plain: s.textOriginal,
                    likeCount: s.likeCount || 0,
                    author: s.authorDisplayName,
                  };
                }) || [];
              allComments.push(...newComments);
              localPageToken = json.nextPageToken || "";
              nextPageToken = localPageToken;
              if (allComments.length >= totalTarget || !localPageToken) {
                callback(allComments.slice(0, totalTarget));
              } else {
                fetchPage();
              }
            } catch (e) {
              callback([], { message: "Parse Error" });
            }
          },
          onerror: () =>
            callback([], {
              message: "Network Error",
            }),
        });
      }
      fetchPage();
    }

    function cleanHTML(text) {
      const div = document.createElement("div");
      div.innerHTML = text;
      return div.textContent || div.innerText || text;
    }

    loadComments();
  }

  let _floatingPlayerDragAbort = null;

  function _bringFloatingPlayerToFront() {
    const fp = document.getElementById("floatingPlayer");
    if (fp) document.body.appendChild(fp);
  }

  function showFloatingPlayer(videoId) {
    const existing = document.getElementById("floatingPlayer");
    if (existing) {
      existing.querySelector("iframe").src = "about:blank";
      if (_floatingPlayerDragAbort) {
        _floatingPlayerDragAbort.abort();
        _floatingPlayerDragAbort = null;
      }
      existing.remove();
    }

    const player = document.createElement("div");
    player.id = "floatingPlayer";
    player.style.cssText = `
      position: fixed !important; top: 60px; right: 20px;
      width: 320px; height: 180px;
      background: transparent; border: 2px solid #555;
      border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      z-index: 2147483647 !important;
      position: fixed; overflow: hidden;
      transition: box-shadow 0.15s;
    `;

    const handle = document.createElement("div");
    handle.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 32px;
      background: linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 8px; cursor: grab; user-select: none;
      opacity: 0; transition: opacity 0.2s; z-index: 10;
    `;
    player.addEventListener("mouseenter", () => { handle.style.opacity = "1"; });
    player.addEventListener("mouseleave", () => { if (!isDragging) handle.style.opacity = "0"; });

    const grip = document.createElement("span");
    grip.textContent = " ⠿ ";
    grip.style.cssText = "letter-spacing:2px; color:#555; font-size:10px; flex-shrink:0;";

    const rightBtns = document.createElement("div");
    rightBtns.style.cssText = "display:flex; align-items:center; gap:2px; flex-shrink:0;";

    const closeBtn = document.createElement("div");
    closeBtn.textContent = "✖";
    closeBtn.style.cssText = "color:#bbb; font-size:13px; cursor:pointer; padding:2px 5px; border-radius:4px; line-height:1; flex-shrink:0; transition:color 0.15s, background 0.15s; user-select:none; display:flex; align-items:center; justify-content:center; width:22px; height:22px;";
    closeBtn.onmouseenter = () => { closeBtn.style.color = "#fff"; closeBtn.style.background = "rgba(200,0,0,0.7)"; };
    closeBtn.onmouseleave = () => { closeBtn.style.color = "#bbb"; closeBtn.style.background = "transparent"; };
    const dragAbort = new AbortController();
    const { signal: dragSignal } = dragAbort;
    _floatingPlayerDragAbort = dragAbort;
    let isDragging = false, ox = 0, oy = 0;

    closeBtn.onclick = (e) => {
      e.stopPropagation();
      player.querySelector("iframe").src = "about:blank";
      dragAbort.abort();
      _floatingPlayerDragAbort = null;
      player.remove();
    };

    rightBtns.appendChild(closeBtn);
    handle.appendChild(grip);
    handle.appendChild(rightBtns);

    const embedDomain = useNoCookieMode
      ? "www.youtube-nocookie.com"
      : "www.youtube.com";

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;border:none;";
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    iframe.tabIndex = 0;
    iframe.src = `https://${embedDomain}/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1`;

    player.appendChild(iframe);
    player.appendChild(handle);

    const resizeHandle = document.createElement("div");
    resizeHandle.title = "Resize";
    resizeHandle.style.cssText = [
      "position:absolute", "bottom:0", "right:0",
      "width:18px", "height:18px",
      "cursor:se-resize", "z-index:11",
      "background:linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.22) 50%)",
      "border-radius:0 0 6px 0",
    ].join(";");

    let isResizing = false, rsX = 0, rsY = 0, rsW = 0, rsH = 0;

    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      rsX = e.clientX; rsY = e.clientY;
      rsW = player.offsetWidth;  rsH = player.offsetHeight;
      iframe.style.pointerEvents = "none";
      e.preventDefault(); e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const newW = Math.max(240, rsW + (e.clientX - rsX));
      const newH = Math.max(135, rsH + (e.clientY - rsY));
      player.style.width  = newW + "px";
      player.style.height = newH + "px";
    }, { signal: dragSignal });

    document.addEventListener("mouseup", () => {
      if (!isResizing) return;
      isResizing = false;
      iframe.style.pointerEvents = "";
    }, { signal: dragSignal });

    player.appendChild(resizeHandle);
    document.body.appendChild(player);

    setTimeout(() => iframe.focus(), 100);

    handle.addEventListener("mousedown", (e) => {
      if (rightBtns.contains(e.target)) return;
      isDragging = true;
      const r = player.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      handle.style.cursor = "grabbing";
      player.style.boxShadow = "0 8px 32px rgba(0,0,0,0.95)";
      iframe.style.pointerEvents = "none";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const maxX = window.innerWidth  - player.offsetWidth;
      const maxY = window.innerHeight - player.offsetHeight;
      player.style.left  = Math.min(maxX, Math.max(0, e.clientX - ox)) + "px";
      player.style.top   = Math.min(maxY, Math.max(0, e.clientY - oy)) + "px";
      player.style.right = "auto";
    }, { signal: dragSignal });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      iframe.style.pointerEvents = "";
      handle.style.cursor = "grab";
      player.style.boxShadow = "0 4px 20px rgba(0,0,0,0.8)";
      if (!player.matches(":hover")) handle.style.opacity = "0";
    }, { signal: dragSignal });

    window.addEventListener("beforeunload", () => dragAbort.abort(), { signal: dragSignal, once: true });
  }

  (function installBodyReplaceGuard() {
    const htmlEl = document.documentElement;
    if (!htmlEl) return;

    new MutationObserver(() => {
      const player = document.getElementById("floatingPlayer");
      if (player && !document.body.contains(player)) {
        document.body.appendChild(player);
        log("🔄 floatingPlayer re-attached after body replacement");
      }
    }).observe(htmlEl, { childList: true });
  })();

  let observer = null;
  let observerRunning = false;

  function startObserver(target, options) {
    if (observerRunning) return;
    if (!target) return;

    if (!observer) {
      observer = new MutationObserver((mutations) => {
        processYTLinks(mutations);
        if (window.location.hostname.includes("discord.com")) {
          const hasNewNodes = mutations.some(
            m => m.type === "childList" && m.addedNodes.length > 0
          );
          if (hasNewNodes) {
            setTimeout(() => { if (isProcessingEnabled) processYTLinks(); }, 900);
            setTimeout(() => { if (isProcessingEnabled) processYTLinks(); }, 2500);
          }
        }
      });
    }

    observer.observe(target, options);
    observerRunning = true;
    log("🔎 MutationObserver started", target);
  }

  function stopObserver() {
    if (!observerRunning) return;

    if (observer) {
      observer.disconnect();
    }
    observerRunning = false;
    log("🛑 MutationObserver stopped");
  }

  const hostname = window.location.hostname;
  const supportedSite = Object.keys(siteConfigs).find((site) =>
    hostname.includes(site),
  );

  if (supportedSite) {
    insertToggleButton(supportedSite);
    if (isPermanentEnabled) {
      isProcessingEnabled = true;
      GM_setValue("ytProcessingEnabled", true);
      stopAutoCloseTimer();

      const _permDelay = (siteConfigs[supportedSite].delay || 1000) + 500;
      setTimeout(() => {
        startObserver(document.body, { childList: true, subtree: true });
        processYTLinks();

        const _exactTarget = document.querySelector(
          siteConfigs[supportedSite].observerTarget,
        );
        if (_exactTarget) {
          stopObserver();
          startObserver(_exactTarget, siteConfigs[supportedSite].observerOptions);
        }

        setTimeout(() => processYTLinks(), 800);
        startSleepTimer();
        console.log("✅ Permanent mode scan started (" + supportedSite + ")");
      }, _permDelay);
    }
    _toggleInterval = setInterval(() => {
      if (!document.querySelector(`[aria-label="${TOGGLE_ARIA_LABEL}"]`))
        insertToggleButton(supportedSite);
    }, 30000);
  } else {
    isProcessingEnabled = true;
    setTimeout(() => {
      processYTLinks();
      startObserver(document.body, { childList: true, subtree: true });
      console.log("✅ General site YouTube preview scan started");
    }, 1500);
  }

  (function installSPARouteGuard() {
    let _spaNavTimer = null;

    function _onSPANavigate() {
      if (_spaNavTimer) clearTimeout(_spaNavTimer);
      _spaNavTimer = setTimeout(() => {
        _spaNavTimer = null;

        if (!isProcessingEnabled) return;

        stopObserver();

        const _site = Object.keys(siteConfigs).find(s =>
          window.location.hostname.includes(s)
        );
        const _targetSel  = _site && siteConfigs[_site].observerTarget;
        const _targetOpts = _site && siteConfigs[_site].observerOptions;
        const _exactNode  = _targetSel ? document.querySelector(_targetSel) : null;

        if (_exactNode) {
          startObserver(_exactNode, _targetOpts);
          log("🔁 SPA navigate — Observer re-attached to", _targetSel);
        } else {
          startObserver(document.body, { childList: true, subtree: true });
          log("🔁 SPA navigate — Observer re-attached to body" + (_targetSel ? " (target not yet mounted)" : ""));
        }

        setTimeout(() => processYTLinks(), 50);
        setTimeout(() => processYTLinks(), 800);
      }, 500);
    }

    const _origPush    = history.pushState.bind(history);
    const _origReplace = history.replaceState.bind(history);
    history.pushState    = (...args) => { _origPush(...args);    _onSPANavigate(); };
    history.replaceState = (...args) => { _origReplace(...args); _onSPANavigate(); };

    window.addEventListener("popstate", _onSPANavigate);
  })();

  window.addEventListener("beforeunload", () => {
    console.log("🧹 Cleanup YouTube preview script");

    stopObserver();

    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    if (sleepTimer) {
      clearTimeout(sleepTimer);
      sleepTimer = null;
    }
    if (hourCloseTimer) {
      clearTimeout(hourCloseTimer);
      hourCloseTimer = null;
    }

    if (processTimeout) {
      clearTimeout(processTimeout);
      processTimeout = null;
    }

    if (_toggleInterval) {
      clearInterval(_toggleInterval);
      _toggleInterval = null;
    }

    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }

    removeYTButtons();

    if (document.body.dataset.ytOverflowLocked) {
      document.body.style.overflow = originalBodyOverflow;
      delete document.body.dataset.ytOverflowLocked;
    }
  });
})();