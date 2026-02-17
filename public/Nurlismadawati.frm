VERSION 5.00
Begin VB.Form Nurlismadawati 
   BackColor       =   &H80000014&
   Caption         =   "Menghitung Depresiasi"
   ClientHeight    =   5805
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   6555
   FillColor       =   &H00FFFFFF&
   ForeColor       =   &H8000000E&
   LinkTopic       =   "Form1"
   ScaleHeight     =   5805
   ScaleWidth      =   6555
   StartUpPosition =   3  'Windows Default
   Begin VB.Label txtHarga 
      BackColor       =   &H80000014&
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Index           =   2
      Left            =   2880
      TabIndex        =   6
      Top             =   3360
      Width           =   2655
   End
   Begin VB.Label lblNilaiSisa 
      Alignment       =   2  'Center
      BackColor       =   &H80000014&
      Caption         =   "NILAI SISA"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Index           =   0
      Left            =   -360
      TabIndex        =   5
      Top             =   3480
      Width           =   3255
   End
   Begin VB.Label txtHarga 
      BackColor       =   &H80000014&
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Index           =   1
      Left            =   2880
      TabIndex        =   4
      Top             =   2520
      Width           =   2655
   End
   Begin VB.Label lblUmur 
      Alignment       =   2  'Center
      BackColor       =   &H80000014&
      Caption         =   "UMUR EKONOMIS"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Index           =   1
      Left            =   0
      TabIndex        =   3
      Top             =   2520
      Width           =   3255
   End
   Begin VB.Label txtHarga 
      BackColor       =   &H8000000E&
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Index           =   0
      Left            =   2880
      TabIndex        =   2
      Top             =   1680
      Width           =   2655
   End
   Begin VB.Label lblHarga 
      Alignment       =   2  'Center
      BackColor       =   &H80000014&
      Caption         =   "HARGA PEROLEHAN"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Index           =   0
      Left            =   120
      TabIndex        =   1
      Top             =   1680
      Width           =   3255
   End
   Begin VB.Label lblJudul 
      Alignment       =   2  'Center
      BackStyle       =   0  'Transparent
      Caption         =   "MENGHITUNG DEPRESIASI GARIS LURUS"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   840
      TabIndex        =   0
      Top             =   720
      Width           =   5055
   End
End
Attribute VB_Name = "Nurlismadawati"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub lblHarga_Click(Index As Integer)

End Sub

Private Sub lblNilaiSisa_Click(Index As Integer)

End Sub

Private Sub lblUmur_Click(Index As Integer)

End Sub

Private Sub txtHarga_Click(Index As Integer)

End Sub
