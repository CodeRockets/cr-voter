if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
nmap gx <Plug>NetrwBrowseX
nnoremap <silent> q :q
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#NetrwBrowseX(expand("<cWORD>"),0)
nnoremap <SNR>9_: :=v:count ? v:count : ''
let &cpo=s:cpo_save
unlet s:cpo_save
set background=dark
set backspace=2
set fileencodings=ucs-bom,utf-8,default,latin1
set laststatus=2
set modelines=0
set runtimepath=~/.vim,~/.vim/bundle/Vundle.vim,~/.vim/bundle/vim-fugitive,~/.vim/bundle/vim-airline,~/.vim/bundle/nerdtree,/usr/share/vim/vimfiles,/usr/share/vim/vim73,/usr/share/vim/vimfiles/after,~/.vim/after,~/.vim/bundle/Vundle.vim,~/.vim/bundle/Vundle.vim/after,~/.vim/bundle/vim-fugitive/after,~/.vim/bundle/vim-airline/after,~/.vim/bundle/nerdtree/after
set window=0
" vim: set ft=vim :
